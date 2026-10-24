import { Zap, Loader2 } from "lucide-react";
import { useUpgradePlan } from "@/context/UpgradeContext";
import { useUserCredits } from "@/hooks/useUserCredits";
import { cn } from "@/lib/utils";

const CreditsBar = () => {
  const { onUpgrade } = useUpgradePlan();
  const { creditsLeft, dailyUsage, loading } = useUserCredits();
  const n = Number(creditsLeft);
  const empty = !loading && Number.isFinite(n) && n <= 0;
  const low = !loading && Number.isFinite(n) && n > 0 && n <= 5;

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mb-4 animate-fade-in-up">
      <div
        role="status"
        className={cn(
          "nb-sticker px-3 py-1.5 flex items-center gap-2 text-sm -rotate-1",
          empty ? "bg-destructive animate-nb-shake" : low ? "bg-[hsl(20_100%_60%)]" : "bg-[hsl(var(--lime))]"
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-label="Loading credits" />
        ) : (
          <>
            <span aria-hidden="true">{empty ? "💀" : "⚡"}</span>
            {empty ? "OUT OF CREDITS" : `${creditsLeft} CREDITS LEFT`}
            {dailyUsage !== undefined && <span className="opacity-70">• {dailyUsage} today</span>}
          </>
        )}
      </div>

      <button type="button" onClick={onUpgrade} className={cn("nb-btn bg-secondary px-3 py-1.5 text-xs flex items-center gap-1.5", (empty || low) && "animate-nb-bounce")}>
        <Zap className="w-4 h-4" strokeWidth={3} />
        Power up
      </button>
    </div>
  );
};
export default CreditsBar;