import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useUpgradePlan } from "@/context/UpgradeContext";
import { useUserCredits } from "@/hooks/useUserCredits";

const CreditsBar = () => {
  const { onUpgrade } = useUpgradePlan();
  const { creditsLeft, dailyUsage, loading } = useUserCredits();

  return (
    <div className="w-full mb-3 animate-fade-in-up absolute -top-[50px] left-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-4 py-2.5 bg-card/80 backdrop-blur-xl border-2 border-border/60 rounded-xl shadow-sm pb-10">
        {/* LEFT SIDE */}
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              {creditsLeft} credits remaining
              {dailyUsage !== undefined && (
                <span>• {dailyUsage} today</span>
              )}
            </>
          )}
        </span>

        {/* RIGHT SIDE */}
        <Button
          type="button"
          onClick={onUpgrade}
          size="sm"
          className="rounded-full px-3 h-7 text-xs font-medium bg-gradient-to-r from-primary to-primary/80"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default CreditsBar;