import { useEffect, useState } from "react";
import { Check, Sparkles, Zap, Building2, User } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useUserPlan } from "@/context/UserPlanContext";
import { useAuth } from "@/context/AuthContext";
import { showError } from "@/lib/alert";

type PricingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const plans = [
  {
    name: "Free", price: "৳0", period: "/month", icon: User, tilt: "-rotate-1",
    bg: "bg-white", description: "Get started with basic translations",
    features: ["50 translations/month", "Basic quality", "Standard response time", "Community support"],
    buttonText: "Current Plan", highlighted: false,
  },
  {
    name: "Starter", price: "৳499", period: "/one-time", icon: Zap, tilt: "rotate-1",
    bg: "bg-[hsl(210_100%_75%)]", description: "For regular users who need more",
    features: ["500 translations/month", "Faster response", "Priority queue", "Email support"],
    buttonText: "Upgrade", highlighted: false,
  },
  {
    name: "Pro", price: "৳999", period: "/one-time", icon: Sparkles, tilt: "-rotate-1",
    bg: "bg-secondary", description: "Best for power users",
    features: ["3,000 translations/month", "Fastest response", "Best quality output", "Priority support", "Advanced features"],
    buttonText: "Upgrade", highlighted: true, badge: "Most Popular",
  },
  {
    name: "Business", price: "৳2999", period: "/one-time", icon: Building2, tilt: "rotate-1",
    bg: "bg-[hsl(var(--lime))]", description: "For teams and enterprises",
    features: ["Unlimited translations", "Highest priority", "API access", "Dedicated support", "Custom integrations"],
    buttonText: "Contact Us", highlighted: false,
  },
];

export const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const { plan: currentPlan } = useUserPlan();
  const { user } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isStartingPayment, setIsStartingPayment] = useState(false);

  useEffect(() => {
    if (redirectUrl) window.location.href = redirectUrl;
  }, [redirectUrl]);

  const upgradeToPro = async (planName: string) => {
    if (!user) return;
    setIsStartingPayment(true);
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ plan: planName }),
      });
      const result: unknown = await res.json();
      if (
        !res.ok ||
        !result ||
        typeof result !== "object" ||
        !("url" in result) ||
        typeof result.url !== "string"
      ) {
        throw new Error("Payment initialization failed");
      }
      setRedirectUrl(result.url);
    } catch (error) {
      console.error("Payment initialization request failed", error);
      showError("Unable to start payment. Please try again.");
      setIsStartingPayment(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl !rounded-none p-0 border-[3px] border-ink bg-background shadow-[8px_8px_0_hsl(var(--ink))] max-h-[90vh] overflow-y-auto">
        <div className="h-3 bg-[repeating-linear-gradient(45deg,hsl(var(--sun))_0_14px,hsl(var(--ink))_14px_28px)] border-b-[3px] border-ink" aria-hidden="true" />

        <div className="px-4 py-8 sm:px-10 sm:py-10">
          <div className="text-center mb-12">
            <DialogTitle className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              <span className="inline-block nb-sticker bg-accent px-3 py-1 -rotate-2">Choose your plan</span>
            </DialogTitle>
            <DialogDescription className="mt-4 font-bold text-foreground/80">
              Unlock more translations and premium features
            </DialogDescription>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = String(plan.name).toUpperCase() === String(currentPlan).toUpperCase();

              return (
                <div
                  key={plan.name}
                  className={cn(
                    "nb-box relative flex flex-col p-5 transition-transform duration-150 hover:-translate-y-1.5 hover:rotate-0",
                    plan.tilt,
                    plan.highlighted && "lg:scale-105 shadow-[8px_8px_0_hsl(var(--accent))]"
                  )}
                >
                  {plan.badge && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 nb-sticker bg-accent px-3 py-1 text-xs uppercase whitespace-nowrap animate-nb-bounce">
                      ★ {plan.badge}
                    </span>
                  )}
                  {/* {isCurrentPlan && (
                    <span className="absolute -top-3 -right-2 nb-sticker bg-[hsl(var(--lime))] px-2 py-0.5 text-[10px] uppercase rotate-6">
                      You are here
                    </span>
                  )} */}

                  <div className={cn("inline-flex self-start p-2.5 border-[3px] border-ink text-[#111]", plan.bg)}>
                    <Icon className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                  </div>

                  <h3 className="mt-4 font-black text-2xl uppercase tracking-tight">{plan.name}</h3>
                  <p className="text-sm font-semibold text-muted-foreground mt-1 min-h-[40px]">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                    <span className="text-sm font-bold text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 py-4 mt-4 border-t-[3px] border-ink flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm font-semibold">
                        <span className={cn("mt-0.5 shrink-0 border-2 border-ink p-0.5 text-[#111]", plan.bg)}>
                          <Check className="h-3 w-3" strokeWidth={4} aria-hidden="true" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    disabled={isCurrentPlan || isStartingPayment}
                    className={cn("nb-btn w-full py-3 text-sm mt-2", isCurrentPlan ? "bg-muted" : plan.highlighted ? "bg-accent" : plan.bg)}
                    onClick={() => {
                      if (plan.name === "Pro" && !isCurrentPlan) upgradeToPro(plan.name.toUpperCase());
                    }}
                  >
                    {isCurrentPlan ? "Current Plan" : plan.buttonText}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs font-bold text-muted-foreground mt-10">
            Payments are one-time. Paid plans currently do not renew or expire automatically.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;