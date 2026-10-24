/**
 * @jest-environment node
 */

import { paymentRedirect } from "@/lib/paymentRedirect";

describe("paymentRedirect", () => {
  it("uses a GET redirect after a payment POST callback", () => {
    const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://app.example";
    const response = paymentRedirect(
      new Request("https://app.example/api/payment/success", { method: "POST" }),
      "/",
      { id: "BL0123456789abcdef01234567", plan: "PRO" },
    );
    if (originalAppUrl === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
    }

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://app.example/?success=true&plan=pro&transaction=BL0123456789abcdef01234567",
    );
  });
});
