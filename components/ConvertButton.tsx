import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConvertButtonProps {
  isLoading: boolean;
  disabled: boolean;
}

const ConvertButton = ({ isLoading, disabled }: ConvertButtonProps) => {
  return (
    <div className="flex justify-center my-6 md:my-8 animate-fade-in-up [animation-delay:200ms]">
      <Button
        type="submit"
        disabled={disabled || isLoading}
        className="gradient-button min-w-[240px] border-0 text-accent-foreground font-semibold text-base md:text-lg px-8 py-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        size="lg"
        aria-disabled={disabled || isLoading}
        aria-describedby="convert-help"
      >
        <span className="flex items-center justify-center relative z-10">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
              <span>Converting...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-bounce-gentle" aria-hidden="true" />
              Convert to Banglish
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </>
          )}
        </span>

        {/* Shimmer effect */}
        {!isLoading && !disabled && (
          <div className="absolute inset-0 motion-safe:animate-shimmer opacity-30 pointer-events-none" />
        )}
      </Button>

      <p id="convert-help" className="sr-only">
        Enter text before converting
      </p>
    </div>
  );
};

export default ConvertButton;
