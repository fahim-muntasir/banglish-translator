import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-center mt-12 pb-8 animate-fade-in-up [animation-delay:400ms]">
      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
        Made with
        <Heart className="w-4 h-4 text-accent fill-accent" aria-hidden="true" /> 
        for language lovers by{" "}
        <a
          href="https://www.linkedin.com/in/fahim-muntasir0909"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Fahim Muntasir's LinkedIn profile"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Fahim Muntasir
        </a>
      </p>
    </footer>
  );
};

export default Footer;


