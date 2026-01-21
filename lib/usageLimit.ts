"use client";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PLAN_LIMITS } from "./plans";
import { UserPlan, UserData } from "@/types/user";

/**
 * Check if a user can convert text.
 * FREE users have daily soft limit.
 * Other plans have monthly limit.
 */

function isNewDay(lastReset?: Date): boolean {
  if (!lastReset) return true;
  const now = new Date();
  return (
    now.getFullYear() !== lastReset.getFullYear() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getDate() !== lastReset.getDate()
  );
}

export async function canUserConvert(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { allowed: false };
  }

  const data = snap.data() as UserData;

  const plan: UserPlan =
    data.plan && PLAN_LIMITS[data.plan] ? data.plan : "FREE";

  const limit = PLAN_LIMITS[plan];
  const now = new Date();

  // -----------------------------
  // MONTHLY RESET
  // -----------------------------
  const resetAt = data.usage?.resetAt?.toDate?.();

  if (!resetAt || now > resetAt) {
    await updateDoc(ref, {
      "usage.count": 0,
      "usage.resetAt": new Date(now.getFullYear(), now.getMonth() + 1, 1),
    });

    data.usage = {
      count: 0,
      resetAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    };
  }

  // -----------------------------
  // MONTHLY LIMIT (ALL PLANS)
  // -----------------------------
  if ((data.usage?.count || 0) >= limit) {
    return {
      allowed: false,
      reason: "MONTHLY_LIMIT",
    };
  }

  // -----------------------------
  // FREE USER — DAILY LIMIT
  // -----------------------------
  if (plan === "FREE") {
    const lastReset = data.lastUsageReset?.toDate?.();

    if (isNewDay(lastReset)) {
      await updateDoc(ref, {
        dailyUsage: 0,
        lastUsageReset: serverTimestamp(),
      });

      data.dailyUsage = 0;
    }

    if ((data.dailyUsage || 0) >= 2) {
      return {
        allowed: false,
        reason: "DAILY_LIMIT",
      };
    }
  }

  return { allowed: true };
}

/**
 * Increase usage counters after a successful conversion
 */
export async function increaseUsage(uid: string): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as UserData;

  const updates: {
    "usage.count": ReturnType<typeof increment>;
    dailyUsage?: ReturnType<typeof increment>;
  } = {
    "usage.count": increment(1),
  };

  if (data.plan === "FREE") {
    updates.dailyUsage = increment(1);
  }

  await updateDoc(ref, updates);
}
