const FloatingShapes = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
    <div className="absolute top-32 -left-6 w-20 h-20 rounded-full bg-accent border-[3px] border-ink animate-nb-float [--r:0deg]" />
    <div className="absolute top-1/3 right-4 w-16 h-16 bg-secondary border-[3px] border-ink animate-nb-float [--r:12deg] [animation-delay:1s]" />
    <div className="absolute bottom-24 left-6 w-0 h-0 border-l-[28px] border-r-[28px] border-b-[48px] border-l-transparent border-r-transparent border-b-primary animate-nb-float [--r:-10deg] [animation-delay:2s]" />
    <div className="absolute bottom-10 right-10 w-24 h-8 bg-[hsl(var(--lime))] border-[3px] border-ink animate-nb-float [--r:-8deg] [animation-delay:3s]" />
  </div>
);
export default FloatingShapes;