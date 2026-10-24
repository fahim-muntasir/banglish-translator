import { ArrowRight } from "lucide-react";

const Header = () => (
  <header className="text-center mb-8 animate-fade-in-up">
    <div className="inline-flex items-center gap-2 mb-6">
      <span className="nb-sticker bg-secondary px-3 py-1.5 text-xl -rotate-3" aria-hidden="true">🌐 ANY</span>
      <ArrowRight className="w-6 h-6" strokeWidth={4} aria-hidden="true" />
      <span className="nb-sticker bg-accent px-3 py-1.5 text-xl rotate-3">BANGLISH</span>
    </div>

    <h1 className="font-black uppercase leading-[0.9] tracking-tighter text-5xl sm:text-7xl md:text-8xl">
      <span className="inline-block nb-sticker bg-primary text-primary-foreground px-3 py-1 -rotate-2 text-4xl sm:text-5xl md:text-6xl mb-2" style={{ color: "hsl(var(--primary-foreground))" }}>
        Fahim-er
      </span>
      <br />
      <span className="gradient-text">Banglish</span>
      <br />
      <span className="inline-block bg-foreground text-background px-3 mt-1 rotate-1">Playground</span>
    </h1>
  </header>
);
export default Header;