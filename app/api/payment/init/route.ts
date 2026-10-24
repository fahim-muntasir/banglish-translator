import { randomBytes } from "node:crypto";
import { FirebaseAuthError } from "firebase-admin/auth";
import { DocumentReference, FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getConfiguredAppUrl } from "@/lib/appUrl";
import { getBearerToken } from "@/lib/serverAuth";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { isPaidPlan, PAID_PLAN_PRICES } from "@/lib/payment";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  let uid: string;
  try {
    ({ uid } = await adminAuth.verifyIdToken(token));
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      return NextResponse.json(
        { success: false, message: "Invalid authentication token" },
        { status: 401 },
      );
    }
    console.error("Payment authentication is unavailable", error);
    return NextResponse.json(
      { success: false, message: "Authentication verification unavailable" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }
  if (!isRecord(body) || typeof body.plan !== "string") {
    return NextResponse.json({ success: false, message: "Invalid plan selected" }, { status: 400 });
  }

  const plan = body.plan.toUpperCase();
  if (!isPaidPlan(plan)) {
    return NextResponse.json({ success: false, message: "Invalid plan selected" }, { status: 400 });
  }

  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const appUrl = getConfiguredAppUrl();
  if (!storeId || !storePassword || !appUrl) {
    console.error("Payment gateway configuration is incomplete");
    return NextResponse.json(
      { success: false, message: "Payment service is not configured" },
      { status: 503 },
    );
  }

  let transactionRef: DocumentReference | undefined;
  try {
    const userRef = adminDb.collection("users").doc(uid);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists || userSnapshot.data()?.isBlocked === true) {
      return NextResponse.json(
        { success: false, message: "Account is unavailable" },
        { status: 403 },
      );
    }

    const price = PAID_PLAN_PRICES[plan];
    const transactionId = `BL${randomBytes(12).toString("hex")}`;
    transactionRef = adminDb.collection("paymentTransactions").doc(transactionId);
    await transactionRef.create({
      uid,
      plan,
      amount: price,
      currency: "BDT",
      status: "PENDING",
      createdAt: FieldValue.serverTimestamp(),
    });

    const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";
    const gatewayUrl = isLive
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
    const callbackUrl = new URL("/api/payment/success", appUrl).toString();
    const failureUrl = new URL("/api/payment/fail", appUrl).toString();
    const cancelUrl = new URL("/api/payment/cancel", appUrl).toString();
    const customer = userSnapshot.data() ?? {};
    const gatewayResponse = await fetch(gatewayUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        store_id: storeId,
        store_passwd: storePassword,
        total_amount: String(price),
        currency: "BDT",
        tran_id: transactionId,
        success_url: callbackUrl,
        fail_url: failureUrl,
        cancel_url: cancelUrl,
        ipn_url: callbackUrl,
        shipping_method: "NO",
        product_name: `${plan} Banglish Translator plan`,
        product_category: "Digital service",
        product_profile: "non-physical-goods",
        cus_name:
          typeof customer.name === "string" && customer.name.trim()
            ? customer.name.slice(0, 100)
            : "Customer",
        cus_email:
          typeof customer.email === "string" && customer.email.trim()
            ? customer.email.slice(0, 100)
            : "customer@example.com",
        cus_add1: "N/A",
        cus_city: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        ship_name: "N/A",
        ship_add1: "N/A",
        ship_city: "Dhaka",
        ship_postcode: "1000",
        ship_country: "Bangladesh",
        value_a: uid,
        value_b: plan,
      }).toString(),
      signal: AbortSignal.timeout(15_000),
    });

    const responseBody: unknown = await gatewayResponse.json();
    const responseData = isRecord(responseBody) ? responseBody : {};
    const redirectUrl =
      typeof responseData.GatewayPageURL === "string"
        ? new URL(responseData.GatewayPageURL)
        : null;
    const allowedGatewayHosts = new Set([
      "securepay.sslcommerz.com",
      "sandbox.sslcommerz.com",
    ]);

    if (
      !gatewayResponse.ok ||
      responseData.status !== "SUCCESS" ||
      !redirectUrl ||
      redirectUrl.protocol !== "https:" ||
      !allowedGatewayHosts.has(redirectUrl.hostname)
    ) {
      await transactionRef.update({
        status: "FAILED",
        updatedAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json(
        { success: false, message: "Payment initialization failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      url: redirectUrl.toString(),
      message: "Payment gateway URL generated successfully",
    });
  } catch (error) {
    if (transactionRef) {
      try {
        await transactionRef.update({
          status: "FAILED",
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (statusError) {
        console.error("Failed to record payment initialization failure", statusError);
      }
    }
    console.error("Payment initialization failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { success: false, message: "Payment initialization failed" },
      { status: 502 },
    );
  }
}
