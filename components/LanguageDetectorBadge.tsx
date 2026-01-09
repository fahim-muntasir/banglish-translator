import { Globe, Sparkles } from "lucide-react";

interface LanguageDetectorBadgeProps {
  detectedLanguage: string | null;
  isDetecting: boolean;
}

const LanguageDetectorBadge = ({ detectedLanguage, isDetecting }: LanguageDetectorBadgeProps) => {
  if (!detectedLanguage && !isDetecting) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary transition-all duration-300">
      {isDetecting ? (
        <>
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Detecting...</span>
        </>
      ) : (
        <>
          <Globe className="w-4 h-4" />
          <span>Detected: {detectedLanguage}</span>
        </>
      )}
    </div>
  );
};

export default LanguageDetectorBadge;
