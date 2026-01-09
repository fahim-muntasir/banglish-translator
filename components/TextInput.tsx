import { ChangeEvent } from "react";
// import LanguageDetectorBadge from "./LanguageDetectorBadge";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  // detectedLanguage: string | null;
  // isDetecting: boolean;
  maxLength?: number;
}

const TextInput = ({ 
  value, 
  onChange, 
  // detectedLanguage, 
  // isDetecting,
  maxLength = 500 
}: TextInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  };

  const characterPercentage = (value.length / maxLength) * 100;

  return (
    <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="bg-card/95 backdrop-blur-md border-2 border-border/60 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex items-center justify-between mb-3">
          {/* <LanguageDetectorBadge 
            detectedLanguage={detectedLanguage} 
            isDetecting={isDetecting} 
          /> */}
          <div className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
            <span className={value.length > maxLength * 0.9 ? 'text-accent font-semibold' : ''}>
              {value.length.toLocaleString()}
            </span>
            <span>/</span>
            <span>{maxLength.toLocaleString()}</span>
          </div>
        </div>
        
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Type or paste text in any language... 🌍"
          className="w-full min-h-[180px] md:min-h-[220px] bg-transparent resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/50 text-base md:text-lg leading-relaxed"
        />
        
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden mt-3">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(characterPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TextInput;