import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface CreditsBarProps {
  creditsLeft: number;
  onUpgrade: () => void;
}

const CreditsBar = ({ creditsLeft, onUpgrade }: CreditsBarProps) => {
  return (
    <div className="w-full mb-3 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-4 py-2.5 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm">
        <span className="text-sm text-muted-foreground font-medium">
          Credits left: <span className="text-foreground font-semibold">{creditsLeft}</span>
        </span>
        
        <Button
          onClick={onUpgrade}
          size="sm"
          className="rounded-full px-4 h-8 text-xs font-medium bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default CreditsBar;