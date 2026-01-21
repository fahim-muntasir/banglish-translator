"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { UserPlan } from "@/types/user";

// export type UserPlan = "FREE" | "STARTER" | "PRO" | "BUSINESS";

type UserPlanContextType = {
  plan: UserPlan;
  loading: boolean;
};

const UserPlanContext = createContext<UserPlanContextType | null>(null);

export const UserPlanProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan>("FREE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlan("FREE");
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPlan(snap.data().plan || "FREE");
        } else {
          setPlan("FREE");
        }
      } catch (err) {
        console.error("Failed to fetch plan", err);
        setPlan("FREE");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [user]);

  return (
    <UserPlanContext.Provider value={{ plan, loading }}>
      {children}
    </UserPlanContext.Provider>
  );
};

export const useUserPlan = () => {
  const ctx = useContext(UserPlanContext);
  if (!ctx) {
    throw new Error("useUserPlan must be used inside UserPlanProvider");
  }
  return ctx;
};
