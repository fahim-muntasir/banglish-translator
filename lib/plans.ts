import { UserPlan } from "@/types/user";

export const PLAN_LIMITS: Record<UserPlan, number> = {
  FREE: 50,
  STARTER: 500,
  PRO: 3000,
  BUSINESS: Infinity,
};
