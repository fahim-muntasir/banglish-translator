import { NextResponse } from "next/server";
import { getConfiguredAppUrl } from "@/lib/appUrl";

function getBaseUrl(request: Request): URL | null {
  return getConfiguredAppUrl() ??
    (process.env.NODE_ENV === "production" ? null : new URL(request.url));
}

export function paymentRedirect(
  request: Request,
  path: string,
  transaction?: { id: string; plan: string },
) {
  const baseUrl = getBaseUrl(request);
  if (!baseUrl) {
    console.error("Payment redirect URL is not configured");
    return NextResponse.json(
      { error: "Payment redirect is not configured" },
      { status: 500 },
    );
  }
  const destination = new URL(path, baseUrl);
  if (transaction) {
    destination.searchParams.set("success", "true");
    destination.searchParams.set("plan", transaction.plan.toLowerCase());
    destination.searchParams.set("transaction", transaction.id);
  }
  return NextResponse.redirect(destination, { status: 303 });
}
