export type UserPlan = "FREE" | "STARTER" | "PRO" | "BUSINESS";

export type UserData = {
  plan: UserPlan;
  usage?: {
    count: number;
    resetAt: Timestamp;
  };
  dailyUsage?: number;
  lastUsageReset?: Timestamp;
}