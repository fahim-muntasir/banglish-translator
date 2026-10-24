import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { paymentRedirect } from "@/lib/paymentRedirect";
import {
  isPaidPlan,
  isValidatedPayment,
  PAID_PLAN_PRICES,
} from "@/lib/payment";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return paymentRedirect(request, "/payment/failed");
  }

  const transactionId = form.get("tran_id");
  const validationId = form.get("val_id");
  if (
    typeof transactionId !== "string" ||
    typeof validationId !== "string" ||
    !transactionId ||
    !validationId
  ) {
    return paymentRedirect(request, "/payment/failed");
  }

  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  if (!storeId || !storePassword) {
    console.error("Payment validation credentials are not configured");
    return paymentRedirect(request, "/payment/failed");
  }

  const transactionRef = adminDb
    .collection("paymentTransactions")
    .doc(transactionId);

  try {
    const transactionSnapshot = await transactionRef.get();
    if (!transactionSnapshot.exists) {
      return paymentRedirect(request, "/payment/failed");
    }

    const payment = transactionSnapshot.data();
    if (!payment || !isPaidPlan(payment.plan) || typeof payment.amount !== "number") {
      return paymentRedirect(request, "/payment/failed");
    }
    if (payment.status === "PAID") {
      return paymentRedirect(request, "/", { id: transactionId, plan: payment.plan });
    }
    if (
      payment.status !== "PENDING" ||
      payment.amount !== PAID_PLAN_PRICES[payment.plan]
    ) {
      return paymentRedirect(request, "/payment/failed");
    }

    const validationUrl = new URL(
      process.env.SSLCOMMERZ_IS_LIVE === "true"
        ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
        : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
    );
    validationUrl.search = new URLSearchParams({
      val_id: validationId,
      store_id: storeId,
      store_passwd: storePassword,
      format: "json",
    }).toString();

    const validationResponse = await fetch(validationUrl, {
      signal: AbortSignal.timeout(15_000),
    });
    const validationBody: unknown = await validationResponse.json();
    if (
      !validationResponse.ok ||
      !isRecord(validationBody) ||
      !isValidatedPayment(validationBody, {
        transactionId,
        validationId,
        amount: payment.amount,
      })
    ) {
      return paymentRedirect(request, "/payment/failed");
    }

    if (typeof payment.uid !== "string" || !payment.uid) {
      return paymentRedirect(request, "/payment/failed");
    }
    const userRef = adminDb.collection("users").doc(payment.uid);
    const outcome = await adminDb.runTransaction(async (transaction) => {
      const [currentPayment, userSnapshot] = await Promise.all([
        transaction.get(transactionRef),
        transaction.get(userRef),
      ]);
      if (!currentPayment.exists || !userSnapshot.exists) return "unavailable";

      const currentStatus = currentPayment.data()?.status;
      if (currentStatus === "PAID") return "paid";
      if (currentStatus !== "PENDING" || userSnapshot.data()?.isBlocked === true) {
        return "unavailable";
      }

      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      transaction.update(userRef, {
        plan: payment.plan,
        "usage.count": 0,
        "usage.resetAt": Timestamp.fromDate(nextMonth),
        dailyUsage: 0,
        lastUsageReset: Timestamp.fromDate(now),
      });
      transaction.update(transactionRef, {
        status: "PAID",
        validationId,
        paidAt: FieldValue.serverTimestamp(),
      });
      return "paid";
    });

    return outcome === "paid"
      ? paymentRedirect(request, "/", { id: transactionId, plan: payment.plan })
      : paymentRedirect(request, "/payment/failed");
  } catch (error) {
    console.error("Payment callback verification failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return paymentRedirect(request, "/payment/failed");
  }
}

export async function GET(request: Request) {
  return paymentRedirect(request, "/payment/failed");
}
