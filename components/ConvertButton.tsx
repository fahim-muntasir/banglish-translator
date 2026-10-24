import { ArrowRight, Sparkles } from "lucide-react";

interface ConvertButtonProps { isLoading: boolean; disabled: boolean; }

const ConvertButton = ({ isLoading, disabled }: ConvertButtonProps) => (
  <div className="flex flex-col items-center my-8 animate-fade-in-up [animation-delay:200ms]">
    <button
      type="submit"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-describedby="convert-help"
      className="nb-btn bg-accent w-full sm:w-auto sm:min-w-[320px] px-8 py-5 text-lg md:text-xl group"
    >
      <span className="flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-3 h-3 bg-[#111] animate-nb-bounce" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </span>
            Converting...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" strokeWidth={3} aria-hidden="true" />
            Convert to Banglish
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} aria-hidden="true" />
          </>
        )}
      </span>
    </button>
    <p id="convert-help" className="mt-3 text-xs font-bold text-muted-foreground">
      Tip: Ctrl/⌘ + Enter to fire
    </p>
  </div>
);
export default ConvertButton;