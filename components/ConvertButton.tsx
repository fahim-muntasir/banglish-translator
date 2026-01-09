import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConvertButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const ConvertButton = ({ onClick, isLoading, disabled }: ConvertButtonProps) => {
  return (
    <div className="flex justify-center my-6 md:my-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="gradient-button border-0 text-accent-foreground font-semibold text-base md:text-lg px-8 py-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-bounce-gentle" />
            Convert to Banglish
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
        
        {/* Shimmer effect */}
        {!isLoading && !disabled && (
          <div className="absolute inset-0 animate-shimmer opacity-30" />
        )}
      </Button>
    </div>
  );
};

export default ConvertButton;
