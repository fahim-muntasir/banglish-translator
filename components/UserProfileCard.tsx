"use client";

import { useState } from "react";
import { LogOut, Crown, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import PricingModal from "./PricingModal";

type UserPlan = "FREE" | "STARTER" | "PRO" | "BUSINESS";

const planConfig: Record<
  UserPlan,
  {
    label: string;
    color: string;
    icon: React.ElementType | null;
  }
> = {
  FREE: {
    label: "Free",
    color: "bg-muted text-muted-foreground",
    icon: null,
  },
  STARTER: {
    label: "Starter",
    color: "bg-blue-500/10 text-blue-600",
    icon: null,
  },
  PRO: {
    label: "Pro",
    color: "bg-primary/10 text-primary",
    icon: Sparkles,
  },
  BUSINESS: {
    label: "Business",
    color: "bg-amber-500/10 text-amber-600",
    icon: Crown,
  },
};

export const UserProfileCard = () => {
  const { user } = useAuth();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  if (!user) return null;

  const userPlan: UserPlan = "FREE";
  const plan = planConfig[userPlan];
  const PlanIcon = plan.icon;

  const initials =
    user.displayName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2) || "U";

  const onUpgrade = () => {
    setIsPricingModalOpen(true);
  };

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 bg-card/80 backdrop-blur-xl border border-border/50 px-3 py-2 rounded-xl shadow-lg cursor-pointer hover:bg-card/90 transition">

            <Avatar className="h-8 w-8 border">
              <AvatarImage
                src={user.photoURL || "/images/default-profile.png"}
                alt={user.displayName || "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-medium text-foreground">
                {user.displayName}
              </span>

              <span
                className={cn(
                  "mt-0.5 text-[10px] px-2 py-[1px] rounded-full font-semibold",
                  plan.color
                )}
              >
                {plan.label}
              </span>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-72 ml-4 p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

          <div className="relative p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 border-2 border-border/50 shadow-sm">
                <AvatarImage
                  src={user.photoURL || "/images/default-profile.png"}
                  alt={user.displayName || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {user.displayName}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>

                <div className="mt-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                      plan.color
                    )}
                  >
                    {PlanIcon && <PlanIcon className="h-3 w-3" />}
                    {plan.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/50" />

            <div className="space-y-2">
              <Button
                onClick={onUpgrade}
                className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade Plan
              </Button>

              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} currentPlan={plan.label} />
    </>
  );
};

export default UserProfileCard;
