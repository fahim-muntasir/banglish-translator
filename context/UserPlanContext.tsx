"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { UserPlan } from "@/types/user";
import { isUserPlan } from "@/lib/plans";

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
    let active = true;
    setPlan("FREE");
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const storedPlan: unknown = snap.data().plan;
          if (active) setPlan(isUserPlan(storedPlan) ? storedPlan : "FREE");
        } else {
          if (active) setPlan("FREE");
        }
      } catch (err) {
        console.error("Failed to fetch plan", err);
        if (active) setPlan("FREE");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPlan();
    return () => {
      active = false;
    };
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
