import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PLAN_LIMITS } from "./plans";
import { UserPlan } from "@/types/user";

export async function canUserConvert(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return false;

  const data = snap.data();

  const plan: UserPlan =
    data.plan && PLAN_LIMITS[data.plan as UserPlan] ? data.plan : "FREE";

  const limit = PLAN_LIMITS[plan];

  const now = new Date();
  const resetAt = data.usage?.resetAt?.toDate();

  // Reset monthly usage
  if (!resetAt || now > resetAt) {
    await updateDoc(ref, {
      "usage.count": 0,
      "usage.resetAt": new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1,
      ),
    });
    return true;
  }

  return data.usage.count < limit;
}

export async function increaseUsage(uid: string) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "usage.count": increment(1),
  });
}
