import { useState } from "react";
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
    
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!output && !isTyping) return null;

  return (
    <div 
      className="w-full animate-fade-in-up" 
      style={{ animationDelay: '0.3s' }}
    >
      <div className="glass-card p-4 md:p-6 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
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
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-primary" />
                  <span className="text-primary">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copy
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Clear
            </Button>
          </div>
        </div>
        
        <div className="min-h-[120px] md:min-h-[150px] text-foreground text-base md:text-lg leading-relaxed">
          <p className={isTyping ? 'typing-cursor' : ''}>
            {output}
          </p>
        </div>
        
        {/* Success indicator */}
        {output && !isTyping && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-2xl">🎉</span>
            <span className="text-sm text-muted-foreground">Conversion complete!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputCard;
