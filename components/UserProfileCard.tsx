"use client";

import { LogOut, Crown, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { useUpgradePlan } from "@/context/UpgradeContext";
import { useUserPlan } from "@/context/UserPlanContext";
import { UserPlan } from "@/types/user";

const planConfig: Record<UserPlan, { label: string; color: string; icon: React.ElementType | null }> = {
  FREE: { label: "Free", color: "bg-white", icon: null },
  STARTER: { label: "Starter", color: "bg-[hsl(210_100%_70%)]", icon: null },
  PRO: { label: "Pro", color: "bg-accent", icon: Sparkles },
  BUSINESS: { label: "Business", color: "bg-secondary", icon: Crown },
};

export const UserProfileCard = () => {
  const { user } = useAuth();
  const { onUpgrade } = useUpgradePlan();
  const { plan: userPlan } = useUserPlan();

  if (!user) return null;

  const plan = planConfig[userPlan];
  const PlanIcon = plan.icon;

  const initials =
    user.displayName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "U";

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="nb-chip fixed bottom-4 left-4 z-50 flex items-center gap-3 px-3 py-2 text-left max-w-[calc(100vw-2rem)]"
        >
          <Avatar className="h-9 w-9 rounded-none border-[3px] border-ink">
            <AvatarImage className="rounded-none" src={user.photoURL || "/images/default-profile.png"} alt={user.displayName || "User"} />
            <AvatarFallback className="rounded-none bg-secondary text-[#111] text-xs font-black">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start leading-tight min-w-0">
            <span className="text-sm font-black truncate max-w-[140px]">{user.displayName}</span>
            <span className={cn("mt-0.5 text-[10px] px-2 py-px border-2 border-ink font-black uppercase text-[#111] -rotate-1", plan.color)}>
              {plan.label}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={12}
        className="w-72 !rounded-none p-0 overflow-hidden border-[3px] border-ink bg-card shadow-[6px_6px_0_hsl(var(--ink))]"
      >
        <div className="h-2 bg-accent border-b-[3px] border-ink" aria-hidden="true" />
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 rounded-none border-[3px] border-ink">
              <AvatarImage className="rounded-none" src={user.photoURL || "/images/default-profile.png"} alt={user.displayName || "User"} />
              <AvatarFallback className="rounded-none bg-secondary text-[#111] font-black">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-black truncate">{user.displayName}</p>
              <p className="text-sm font-semibold text-muted-foreground truncate">{user.email}</p>
              <span className={cn("mt-1.5 inline-flex items-center gap-1 text-xs px-2 py-0.5 nb-sticker uppercase rotate-1", plan.color)}>
                {PlanIcon && <PlanIcon className="h-3 w-3" aria-hidden="true" />}
                {plan.label}
              </span>
            </div>
          </div>

          <div className="h-[3px] bg-ink" />

          <div className="space-y-3">
            <button type="button" onClick={onUpgrade} className="nb-btn w-full flex items-center justify-center gap-2 bg-accent py-2.5 text-sm">
              <Sparkles className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              Upgrade Plan
            </button>
            <button type="button" onClick={onLogout} className="nb-btn w-full flex items-center justify-center gap-2 bg-white py-2.5 text-sm">
              <LogOut className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfileCard;