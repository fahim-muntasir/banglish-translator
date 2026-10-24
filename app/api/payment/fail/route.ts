import { NextRequest } from "next/server";
import { paymentRedirect } from "@/lib/paymentRedirect";

export function POST(request: NextRequest) {
  return paymentRedirect(request, "/payment/failed");
}

export function GET(request: NextRequest) {
  return paymentRedirect(request, "/payment/failed");
}