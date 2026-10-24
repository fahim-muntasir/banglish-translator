import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { isUserPlan, PLAN_LIMITS } from "@/lib/plans";
import { UserData } from "@/types/user";

type CreditState = {
  uid: string | null;
  creditsLeft: number;
  dailyUsage?: number;
  loading: boolean;
};

export function useUserCredits() {
  const { user } = useAuth();
  const [creditState, setCreditState] = useState<CreditState>({
    uid: null,
    creditsLeft: 0,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setCreditState({
          uid: user.uid,
          creditsLeft: 0,
          loading: false,
        });
        return;
      }

      const data = snap.data() as UserData;

      const plan = isUserPlan(data.plan) ? data.plan : "FREE";
      const limit = PLAN_LIMITS[plan];
      const storedMonthlyUsage = data.usage?.count;
      const monthlyUsed =
        typeof storedMonthlyUsage === "number" &&
        Number.isFinite(storedMonthlyUsage) &&
        storedMonthlyUsage >= 0
          ? storedMonthlyUsage
          : 0;

      let dailyUsage: number | undefined;
      if (plan === "FREE") {
        const storedDailyUsage = data.dailyUsage;
        const dailyUsed =
          typeof storedDailyUsage === "number" &&
          Number.isFinite(storedDailyUsage) &&
          storedDailyUsage >= 0
            ? storedDailyUsage
            : 0;
        dailyUsage = Math.max(0, 2 - dailyUsed);
      }

      setCreditState({
        uid: user.uid,
        creditsLeft: Math.max(0, limit - monthlyUsed),
        dailyUsage,
        loading: false,
      });
    }, (error) => {
      console.error("Failed to subscribe to user credits", error);
      setCreditState({
        uid: user.uid,
        creditsLeft: 0,
        loading: false,
      });
    });

    return () => unsub();
  }, [user]);

  // dailyUsage is only for FREE plan
  const stateIsCurrent = user !== null && creditState.uid === user.uid;
  return {
    creditsLeft: stateIsCurrent ? creditState.creditsLeft : 0,
    dailyUsage: stateIsCurrent ? creditState.dailyUsage : undefined,
    loading: user !== null && (!stateIsCurrent || creditState.loading),
  };
}
