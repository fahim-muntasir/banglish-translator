import { isPaidPlan, isValidatedPayment } from "@/lib/payment";

describe("payment validation", () => {
  it("recognizes only paid plans", () => {
    expect(isPaidPlan("PRO")).toBe(true);
    expect(isPaidPlan("FREE")).toBe(false);
    expect(isPaidPlan("pro")).toBe(false);
    expect(isPaidPlan(null)).toBe(false);
  });

  it("accepts only verified payments with matching transaction details", () => {
    const expected = {
      transactionId: "BL0123456789abcdef01234567",
      validationId: "VALIDATION-1",
      amount: 999,
    };
    const validResponse = {
      status: "VALID",
      tran_id: expected.transactionId,
      val_id: expected.validationId,
      amount: "999.00",
      currency: "BDT",
    };

    expect(isValidatedPayment(validResponse, expected)).toBe(true);
    expect(
      isValidatedPayment({ ...validResponse, status: "FAILED" }, expected),
    ).toBe(false);
    expect(
      isValidatedPayment({ ...validResponse, tran_id: "other" }, expected),
    ).toBe(false);
    expect(
      isValidatedPayment({ ...validResponse, val_id: "other" }, expected),
    ).toBe(false);
    expect(
      isValidatedPayment({ ...validResponse, amount: "1.00" }, expected),
    ).toBe(false);
    expect(
      isValidatedPayment({ ...validResponse, currency: "USD" }, expected),
    ).toBe(false);
  });
});
