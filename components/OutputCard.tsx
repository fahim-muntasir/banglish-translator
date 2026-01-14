import { useState, memo } from "react";
import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutputCardProps {
  output: string;
  isTyping: boolean;
  onClear: () => void;
}

const OutputCard = ({ output, isTyping, onClear }: OutputCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // Keep the component in the DOM if possible, or use a wrapper to avoid CLS
  if (!output && !isTyping) return null;

  return (
    <div
      className="w-full animate-fade-in-up [animation-delay:300ms]"
    >
      <div className="glass-card p-4 md:p-6 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <span className="font-semibold text-foreground">Banglish Output</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!output || isTyping}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-xl"
              aria-label="Copy converted text"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-primary" aria-hidden="true" />
                  <span className="text-primary">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  Copy
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-xl"
              aria-label="Clear output"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Clear
            </Button>
          </div>
        </div>

        {/* white-space: pre-wrap ensures line breaks from the API are preserved */}
        <div className="min-h-[120px] md:min-h-[150px] text-foreground text-base md:text-lg leading-relaxed whitespace-pre-wrap">
          <p className={isTyping ? 'typing-cursor' : ''}>
            {output}
          </p>
        </div>

        {output && !isTyping && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border/50 animate-in fade-in zoom-in duration-300">
            <span className="text-2xl" role="img" aria-label="party popper">🎉</span>
            <span className="text-sm text-muted-foreground font-medium">Conversion complete!</span>
          </div>
        )}
      </div>

      <div aria-live="polite" className="sr-only">
        {copied ? "Converted text copied to clipboard" : ""}
        {isTyping ? "Converting your text..." : ""}
      </div>
    </div>
  );
};

const MemoizedOutputCard = memo(OutputCard);
MemoizedOutputCard.displayName = "OutputCard";
export default MemoizedOutputCard;