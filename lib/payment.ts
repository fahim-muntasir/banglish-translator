export const PAID_PLAN_PRICES = {
  STARTER: 499,
  PRO: 999,
  BUSINESS: 2999,
} as const;

export type PaidPlan = keyof typeof PAID_PLAN_PRICES;

export function isPaidPlan(value: unknown): value is PaidPlan {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(PAID_PLAN_PRICES, value)
  );
}

type ValidatedPayment = {
  status: string;
  tran_id: string;
  val_id: string;
  amount: string | number;
  currency: string;
};

export function isValidatedPayment(
  value: unknown,
  expected: { transactionId: string; validationId: string; amount: number },
): value is ValidatedPayment {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  const amount =
    typeof result.amount === "number" || typeof result.amount === "string"
      ? Number(result.amount)
      : Number.NaN;

  return (
    (result.status === "VALID" || result.status === "VALIDATED") &&
    result.tran_id === expected.transactionId &&
    result.val_id === expected.validationId &&
    Number.isFinite(amount) &&
    amount === expected.amount &&
    result.currency === "BDT"
  );
}
