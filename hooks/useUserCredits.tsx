import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { PLAN_LIMITS } from "@/lib/plans";
import { UserPlan, UserData } from "@/types/user";

export function useUserCredits() {
  const { user } = useAuth();
  const [creditsLeft, setCreditsLeft] = useState<number>(0);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data() as UserData;

      const plan: UserPlan = data.plan || "FREE";
      const limit = PLAN_LIMITS[plan];

      // FREE → daily limit
      if (plan === "FREE") {
        const used = data.dailyUsage || 0;
        setDailyUsage(Math.max(0, 2 - used));
      }

      const used = data.usage?.count || 0;
        setCreditsLeft(Math.max(0, limit - used));

      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // dailyUsage is only for FREE plan
  return { creditsLeft, dailyUsage, loading };
}
