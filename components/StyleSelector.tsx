import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Laugh,
  Briefcase,
  Heart,
  Share2,
  BookOpen,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type TranslationStyle =
  | "casual"
  | "funny"
  | "professional"
  | "romantic"
  | "attitude"
  | "facebook"
  | "storytelling";

type StyleOption = {
  id: TranslationStyle;
  label: string;
  icon: React.ReactNode;
}

const styleOptions: StyleOption[] = [
  { id: "casual", label: "Casual", icon: <MessageCircle className="w-4 h-4" /> },
  { id: "funny", label: "Funny", icon: <Laugh className="w-4 h-4" /> },
  { id: "professional", label: "Professional", icon: <Briefcase className="w-4 h-4" /> },
  { id: "romantic", label: "Romantic", icon: <Heart className="w-4 h-4" /> },
  { id: "attitude", label: "Attitude", icon: <Flame className="w-4 h-4" /> },
  { id: "facebook", label: "Facebook Post", icon: <Share2 className="w-4 h-4" /> },
  { id: "storytelling", label: "Storytelling", icon: <BookOpen className="w-4 h-4" /> },
];

interface StyleSelectorProps {
  selectedStyle: TranslationStyle;
  onStyleChange: (style: TranslationStyle) => void;
}

const StyleSelector = ({ selectedStyle, onStyleChange }: StyleSelectorProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center flex-wrap gap-2 pb-2">
        {styleOptions.map((style) => (
          <Button
            type="button"
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
              "border backdrop-blur-md",
              selectedStyle === style.id
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground scale-105"
                : "bg-card/60 text-muted-foreground border-border/50 hover:bg-card hover:text-foreground hover:border-primary/30 hover:shadow-md"
            )}
          >
            <span className={cn(
              "transition-transform duration-300",
              selectedStyle === style.id && "scale-110"
            )}>
              {style.icon}
            </span>
            {style.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;