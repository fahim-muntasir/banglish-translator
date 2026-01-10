import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingShapes from "@/components/FloatingShapes";
import ThemeToggle from "@/components/ThemeToggle";
import FlagButton from "@/components/FlagButton";
import ConverterPanel from "@/components/ConverterPanel";

export default function Home() {

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FlagButton />
      <ThemeToggle />
      <FloatingShapes />

      <main className="relative z-10 container max-w-2xl mx-auto px-4 py-20 md:py-24">
        <Header />
        <ConverterPanel />
        <Footer />
      </main>
    </div>
  );
}
