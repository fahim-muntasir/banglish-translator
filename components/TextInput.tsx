import { ChangeEvent } from "react";
import ConvertButton from "./ConvertButton";
import CreditsBar from "./CreditsBar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
  maxLength?: number;
};

const TextInput = ({ value, onChange, onSubmit, isLoading, disabled, maxLength = 500 }: TextInputProps) => {
  const { user } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) onChange(e.target.value);
  };

  const pct = Math.min(value.length / maxLength, 1);
  const hot = pct > 0.9;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {user && <CreditsBar />}

      <div className="animate-fade-in-up [animation-delay:100ms]">
        <p className="font-black uppercase text-sm mb-3 tracking-widest">② Drop your text</p>
        <div className="nb-box focus-within:shadow-[8px_8px_0_hsl(var(--accent))] transition-shadow">
          <div className="flex items-center justify-between px-4 py-2 border-b-[3px] border-ink bg-secondary text-secondary-foreground">
            <span className="font-black uppercase text-sm">▶ Input</span>
            <span id="char-count" className={cn("font-black text-sm tabular-nums", hot && "text-destructive")}>
              {value.length.toLocaleString()} / {maxLength.toLocaleString()}
            </span>
          </div>

          <label htmlFor="input-text" className="sr-only">Enter text to convert</label>
          <textarea
            id="input-text"
            aria-describedby="char-count"
            value={value}
            onChange={handleChange}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); onSubmit(); }
            }}
            placeholder="Type or paste text in any language... 🌍"
            className="block w-full min-h-[180px] md:min-h-[220px] p-4 bg-transparent resize-none focus:outline-none text-base md:text-lg leading-relaxed font-semibold placeholder:text-muted-foreground/60"
          />

          <div className="h-4 border-t-[3px] border-ink bg-muted" role="presentation">
            <div
              className={cn("h-full origin-left transition-transform duration-200", hot ? "bg-destructive" : "bg-primary")}
              style={{ transform: `scaleX(${pct})` }}
            />
          </div>
        </div>
      </div>

      <ConvertButton isLoading={isLoading} disabled={disabled} />
    </form>
  );
};
export default TextInput;