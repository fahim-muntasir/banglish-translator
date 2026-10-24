import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingShapes from "@/components/FloatingShapes";
import ThemeToggle from "@/components/ThemeToggle";
import FlagButton from "@/components/FlagButton";
import SigninButton from "@/components/SigninButton";
import ConverterPanel from "@/components/ConverterPanel";

const ticker = ["CASUAL", "FUNNY", "PROFESSIONAL", "ROMANTIC", "ATTITUDE", "FACEBOOK", "STORY"];

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FlagButton />
      <ThemeToggle />
      <SigninButton />
      <FloatingShapes />

      <main className="relative z-10 container max-w-3xl mx-auto px-4 pt-24 pb-10 md:pt-28">
        <Header />
        <div aria-hidden="true" className="-mx-4 md:mx-0 mb-10 overflow-hidden border-y-[3px] md:border-[3px] border-ink bg-secondary text-secondary-foreground -rotate-1">
          <div className="flex w-max animate-nb-marquee py-2 font-black tracking-widest text-sm">
            {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
              <span key={i} className="px-4">{t} ★</span>
            ))}
          </div>
        </div>
        <ConverterPanel />
        <Footer />
      </main>
    </div>
  );
}