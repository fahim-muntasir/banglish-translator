import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { PLAN_LIMITS } from "@/lib/plans";
import { isUserPlan } from "@/lib/plans";
import { UserPlan } from "@/types/user";

type UsageReservation = {
  monthlyResetAt: Timestamp;
  dailyResetAt?: Timestamp;
};

type ReservationResult =
  | { allowed: true; reservation: UsageReservation }
  | { allowed: false; reason: "ACCOUNT_UNAVAILABLE" | "DAILY_LIMIT" | "MONTHLY_LIMIT" };

function toTimestamp(value: unknown): Timestamp | undefined {
  if (value instanceof Timestamp) return value;
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    const date = value.toDate();
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return Timestamp.fromDate(date);
    }
  }
  return undefined;
}

function isNewDay(lastReset: Timestamp | undefined, now: Date): boolean {
  if (!lastReset) return true;
  const date = lastReset.toDate();
  return (
    now.getFullYear() !== date.getFullYear() ||
    now.getMonth() !== date.getMonth() ||
    now.getDate() !== date.getDate()
  );
}

export async function reserveConversion(
  uid: string,
): Promise<ReservationResult> {
  const ref = adminDb.collection("users").doc(uid);
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const defaultMonthlyReset = Timestamp.fromDate(nextMonth);

  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return { allowed: false, reason: "ACCOUNT_UNAVAILABLE" };

    const data = snapshot.data()!;
    if (data.isBlocked === true) {
      return { allowed: false, reason: "ACCOUNT_UNAVAILABLE" };
    }

    const plan: UserPlan = isUserPlan(data.plan) ? data.plan : "FREE";
    const limit = PLAN_LIMITS[plan];
    const storedMonthlyReset = toTimestamp(data.usage?.resetAt);
    const shouldResetMonthly =
      !storedMonthlyReset || now > storedMonthlyReset.toDate();
    const monthlyResetAt = shouldResetMonthly
      ? defaultMonthlyReset
      : storedMonthlyReset;
    const monthlyCount =
      shouldResetMonthly || !Number.isFinite(data.usage?.count) ||
      data.usage.count < 0
        ? 0
        : data.usage.count;

    if (monthlyCount >= limit) {
      return { allowed: false, reason: "MONTHLY_LIMIT" };
    }

    let dailyResetAt: Timestamp | undefined;
    let dailyCount = 0;
    if (plan === "FREE") {
      const storedDailyReset = toTimestamp(data.lastUsageReset);
      const shouldResetDaily = isNewDay(storedDailyReset, now);
      dailyResetAt = shouldResetDaily
        ? Timestamp.fromDate(now)
        : storedDailyReset;
      dailyCount =
        shouldResetDaily || !Number.isFinite(data.dailyUsage) ||
        data.dailyUsage < 0
          ? 0
          : data.dailyUsage;

      if (dailyCount >= 2) {
        return { allowed: false, reason: "DAILY_LIMIT" };
      }
    }

    transaction.update(ref, {
      "usage.count": monthlyCount + 1,
      "usage.resetAt": monthlyResetAt,
      ...(plan === "FREE"
        ? {
            dailyUsage: dailyCount + 1,
            lastUsageReset: dailyResetAt,
          }
        : {}),
    });

    return {
      allowed: true,
      reservation: { monthlyResetAt, dailyResetAt },
    };
  });
}

export async function releaseConversion(
  uid: string,
  reservation: UsageReservation,
): Promise<void> {
  const ref = adminDb.collection("users").doc(uid);

  await adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return;

    const data = snapshot.data()!;
    const storedMonthlyReset = toTimestamp(data.usage?.resetAt);
    const updates: Record<string, number> = {};

    if (
      storedMonthlyReset?.isEqual(reservation.monthlyResetAt) &&
      Number.isFinite(data.usage?.count) &&
      data.usage.count > 0
    ) {
      updates["usage.count"] = data.usage.count - 1;
    }

    const storedDailyReset = toTimestamp(data.lastUsageReset);
    if (
      reservation.dailyResetAt &&
      storedDailyReset?.isEqual(reservation.dailyResetAt) &&
      Number.isFinite(data.dailyUsage) &&
      data.dailyUsage > 0
    ) {
      updates.dailyUsage = data.dailyUsage - 1;
    }

    if (Object.keys(updates).length > 0) transaction.update(ref, updates);
  });
}
