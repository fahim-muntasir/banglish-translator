import { useState, memo } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputCardProps { output: string; isTyping: boolean; onClear: () => void; }

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

  if (!output && !isTyping) return null;

  return (
    <div className="w-full animate-fade-in-up [animation-delay:300ms]">
      <p className="font-black uppercase text-sm mb-3 tracking-widest">③ Your Banglish</p>
      <div className="nb-box relative">
        <div className="flex items-center justify-between gap-2 flex-wrap px-4 py-2 border-b-[3px] border-ink bg-[hsl(var(--lime))] text-[#111]">
          <span className="font-black uppercase text-sm">★ Output</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output || isTyping}
              aria-label="Copy converted text"
              className={cn("nb-btn px-3 py-1.5 text-xs flex items-center gap-1.5", copied ? "bg-secondary animate-nb-pop" : "bg-white")}
            >
              {copied ? <Check className="w-4 h-4" strokeWidth={4} aria-hidden="true" /> : <Copy className="w-4 h-4" strokeWidth={3} aria-hidden="true" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button type="button" onClick={onClear} aria-label="Clear output" className="nb-btn bg-white px-3 py-1.5 text-xs flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
              Clear
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 min-h-[120px] md:min-h-[150px] text-base md:text-xl leading-relaxed font-semibold whitespace-pre-wrap">
          <p className={isTyping ? "typing-cursor" : ""}>{output}</p>
        </div>

        {output && !isTyping && (
          <div className="absolute -bottom-5 right-4 nb-sticker bg-secondary px-3 py-1 text-sm animate-nb-pop">
            🎉 LEVEL CLEAR!
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