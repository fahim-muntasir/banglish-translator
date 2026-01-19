import { Check, Sparkles, Zap, Building2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan?: string;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    icon: User,
    description: "Get started with basic translations",
    features: [
      "50 translations/month",
      "Basic quality",
      "Standard response time",
      "Community support",
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$5",
    period: "/month",
    icon: Zap,
    description: "For regular users who need more",
    features: [
      "500 translations/month",
      "Faster response",
      "Priority queue",
      "Email support",
    ],
    buttonText: "Upgrade",
    buttonVariant: "default" as const,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/month",
    icon: Sparkles,
    description: "Best for power users",
    features: [
      "3,000 translations/month",
      "Fastest response",
      "Best quality output",
      "Priority support",
      "Advanced features",
    ],
    buttonText: "Upgrade",
    buttonVariant: "default" as const,
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    icon: Building2,
    description: "For teams and enterprises",
    features: [
      "Unlimited translations",
      "Highest priority",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    buttonText: "Contact Us",
    buttonVariant: "outline" as const,
    highlighted: false,
  },
];

export const PricingModal = ({ open, onOpenChange, currentPlan = "Free" }: PricingModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl p-0 overflow-hidden border-0 bg-background/90 backdrop-blur-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        {/* <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button> */}

        <div className="relative px-6 py-8 sm:px-10 sm:py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Choose your plan</h2>
            <p className="mt-2 text-muted-foreground">
              Unlock more translations and premium features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.name === currentPlan;
              
              return (
                <div
                  key={plan.name}
                  className={cn(
                    "relative group rounded-2xl p-6 transition-all duration-300",
                    plan.highlighted
                      ? "bg-gradient-to-b from-primary/10 to-primary/5 border-2 border-primary/30 shadow-lg shadow-primary/10"
                      : "bg-card/50 border border-border/50 hover:border-border hover:shadow-md"
                  )}
                >
                  {plan.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground shadow-lg">
                      {plan.badge}
                    </Badge>
                  )}

                  <div className="space-y-4">
                    <div className={cn(
                      "inline-flex p-2.5 rounded-xl",
                      plan.highlighted 
                        ? "bg-primary/20" 
                        : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        plan.highlighted ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>

                    <ul className="space-y-2.5 py-4 border-t border-border/50">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className={cn(
                            "h-4 w-4 mt-0.5 shrink-0",
                            plan.highlighted ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={isCurrentPlan ? "outline" : plan.buttonVariant}
                      className={cn(
                        "w-full rounded-xl transition-all",
                        plan.highlighted && !isCurrentPlan && "bg-primary hover:bg-primary/90 shadow-md",
                        isCurrentPlan && "cursor-default opacity-70"
                      )}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? "Current Plan" : plan.buttonText}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground/60 mt-8">
            All plans include access to our core translation engine. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;