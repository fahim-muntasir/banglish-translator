import { ChangeEvent } from "react";
import ConvertButton from "./ConvertButton";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
  maxLength?: number;
}

const TextInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled,
  maxLength = 500
}: TextInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  };

  const characterPercentage = (value.length / maxLength) * 100;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="w-full animate-fade-in-up [animation-delay:100ms]">
        <div className="bg-card/95 backdrop-blur-md border-2 border-border/60 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary/20">
          
          <div className="flex items-center justify-between mb-3">
            <div id="char-count" className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
              <span className={value.length > maxLength * 0.9 ? 'text-accent font-semibold' : ''}>
                {value.length.toLocaleString()}
              </span>
              <span>/</span>
              <span>{maxLength.toLocaleString()}</span>
            </div>
          </div>

          <label htmlFor="input-text" className="sr-only">
            Enter text to convert
          </label>

          <textarea
            id="input-text"
            aria-describedby="char-count"
            value={value}
            onChange={handleChange}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Type or paste text in any language... 🌍"
            className="w-full min-h-[180px] md:min-h-[220px] bg-transparent resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/50 text-base md:text-lg leading-relaxed"
          />

          <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 origin-left rounded-full"
              style={{ transform: `scaleX(${Math.min(characterPercentage / 100, 1)})` }}
            />
          </div>
        </div>
      </div>

      <ConvertButton
        isLoading={isLoading}
        disabled={disabled}
      />
    </form>
  );
};

export default TextInput;