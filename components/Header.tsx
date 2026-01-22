import { ArrowRight } from "lucide-react";

const Header = () => {
  return (
    <header className="text-center mb-8 animate-fade-in-up">
      <div className="inline-flex items-center justify-center gap-2 mb-4">
        <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <span className="text-xl md:text-2xl font-bold text-primary">🌐</span>
        </div>
        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
        <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
          <span className="text-xl md:text-2xl font-bold text-accent">Banglish</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight text-center">
        <span className="gradient-text">Fahim</span>
        <span className="text-foreground">-er </span>
        <span
          className="inline-block h-10 md:h-14 lg:h-16 text-transparent bg-clip-text bg-cover bg-center bg-white dark:bg-slate-950 [background-image:url('/images/banglish-bg.webp')]"
        >
          Banglish
        </span>

        <br />

        <span className="text-foreground">Translator</span>
      </h1>

      <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
        Convert any language into Banglish instantly ✨
      </p>
    </header>
  );
};

export default Header;