import { cn } from "@/lib/utils";
import { MessageCircle, Laugh, Briefcase, Heart, Share2, BookOpen, Flame } from "lucide-react";

export type TranslationStyle =
  | "casual" | "funny" | "professional" | "romantic" | "attitude" | "facebook" | "storytelling";

type StyleOption = { id: TranslationStyle; label: string; icon: React.ReactNode; bg: string };

const styleOptions: StyleOption[] = [
  { id: "casual", label: "Casual", icon: <MessageCircle className="w-4 h-4" />, bg: "bg-secondary" },
  { id: "funny", label: "Funny", icon: <Laugh className="w-4 h-4" />, bg: "bg-[hsl(var(--lime))]" },
  { id: "professional", label: "Professional", icon: <Briefcase className="w-4 h-4" />, bg: "bg-[hsl(231_99%_75%)]" },
  { id: "romantic", label: "Romantic", icon: <Heart className="w-4 h-4" />, bg: "bg-accent" },
  { id: "attitude", label: "Attitude", icon: <Flame className="w-4 h-4" />, bg: "bg-[hsl(20_100%_60%)]" },
  { id: "facebook", label: "Facebook Post", icon: <Share2 className="w-4 h-4" />, bg: "bg-[hsl(210_100%_70%)]" },
  { id: "storytelling", label: "Storytelling", icon: <BookOpen className="w-4 h-4" />, bg: "bg-[hsl(280_90%_75%)]" },
];

interface StyleSelectorProps {
  selectedStyle: TranslationStyle;
  onStyleChange: (style: TranslationStyle) => void;
}

const StyleSelector = ({ selectedStyle, onStyleChange }: StyleSelectorProps) => (
  <section aria-label="Choose a style" className="mb-6">
    <p className="font-black uppercase text-sm mb-3 text-center tracking-widest">① Pick your vibe</p>
    <div role="radiogroup" className="flex justify-center flex-wrap gap-3">
      {styleOptions.map((s, i) => {
        const active = selectedStyle === s.id;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onStyleChange(s.id)}
            className={cn(
              "nb-chip flex items-center gap-2 px-3 py-2 text-sm uppercase",
              i % 2 ? "rotate-1" : "-rotate-1",
              active ? `${s.bg} text-[#111] -translate-y-1 scale-105 !shadow-[5px_5px_0_hsl(var(--ink))]` : "text-foreground"
            )}
          >
            {s.icon}
            {s.label}
            {active && <span aria-hidden="true">✓</span>}
          </button>
        );
      })}
    </div>
  </section>
);
export default StyleSelector;