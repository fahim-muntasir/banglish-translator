const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Main gradient background - improved contrast */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-accent/3 dark:from-primary/5 dark:via-background dark:to-accent/5" /> */}


      {/* Top flowing curves */}
      {/* <svg
        className="absolute -top-10 -right-10 w-[700px] h-[450px] opacity-40 dark:opacity-25"
        viewBox="0 0 700 450"
        fill="none"
      >
        <path
          d="M0 200 Q175 30 350 150 T700 80"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0 250 Q200 80 400 180 T700 120"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M0 300 Q250 130 450 220 T700 160"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <ellipse cx="550" cy="120" rx="100" ry="100" fill="url(#gradientPrimary)" opacity="0.3" />
      </svg> */}

      {/* Left side flowing curves */}
      {/* <svg
        className="absolute top-1/4 -left-20 w-[350px] h-[600px] opacity-35 dark:opacity-20"
        viewBox="0 0 350 600"
        fill="none"
      >
        <path
          d="M30 0 Q80 150 30 300 T80 600"
          stroke="hsl(var(--accent))"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M70 0 Q120 180 70 360 T120 600"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M110 0 Q160 200 110 400 T160 600"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          fill="none"
          opacity="0.3"
        />
        <circle cx="60" cy="250" r="60" fill="url(#gradientAccent)" opacity="0.4" />
      </svg> */}

      <svg
        className="absolute inset-0 w-full h-full opacity-30 dark:opacity-15"
        viewBox="0 0 1000 1000"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Vertical lines with different colors but same opacity */}
        {[...Array(20)].map((_, i) => {
          const color = i % 3 === 0
            ? 'hsl(var(--primary))'
            : i % 3 === 1
              ? 'hsl(var(--accent))'
              : 'hsl(var(--primary))';

          return (
            <line
              key={i}
              x1={(i * 50).toString()} // spacing every 50 units
              y1="0"
              x2={(i * 50).toString()}
              y2="1000"
              stroke={color}
              strokeWidth={i % 3 === 0 ? 1 : i % 3 === 1 ? 0.8 : 0.6}
              opacity={0.4} // same opacity for all
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Center horizontal flowing lines */}
      {/* <svg
        className="absolute top-1/3 left-0 w-full h-[300px] opacity-20 dark:opacity-12"
        viewBox="0 0 1400 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 100 Q350 40 700 100 T1400 70"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M0 140 Q400 60 800 130 T1400 100"
          stroke="hsl(var(--accent))"
          strokeWidth="0.8"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M0 180 Q450 90 900 170 T1400 140"
          stroke="hsl(var(--primary))"
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
        />
      </svg> */}

      {/* Bottom horizontal flowing lines */}
      {/* <svg
        className="absolute bottom-1/4 left-0 w-full h-[250px] opacity-18 dark:opacity-10"
        viewBox="0 0 1400 250"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80 Q300 150 600 80 T1400 100"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M0 120 Q350 180 700 110 T1400 130"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M0 160 Q400 210 800 150 T1400 170"
          stroke="hsl(var(--accent))"
          strokeWidth="0.6"
          fill="none"
          opacity="0.25"
        />
      </svg> */}

      {/* Bottom right abstract shape */}
      {/* <svg
        className="absolute -bottom-10 -right-10 w-[450px] h-[350px] opacity-30 dark:opacity-18"
        viewBox="0 0 450 350"
        fill="none"
      >
        <path
          d="M450 350 Q300 260 350 130 T250 0"
          stroke="hsl(var(--primary))"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M450 300 Q320 220 360 100 T280 0"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M450 250 Q340 180 370 70 T310 0"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          fill="none"
          opacity="0.25"
        />
        <ellipse cx="360" cy="260" rx="80" ry="65" fill="url(#gradientMixed)" opacity="0.35" />
      </svg> */}

      {/* Floating geometric shapes - softer */}
      {/* <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-3xl bg-primary/5 dark:bg-primary/8 rotate-12 blur-md" />
      <div className="absolute bottom-1/3 left-1/4 w-14 h-14 rounded-full bg-accent/5 dark:bg-accent/8 blur-md" />
      <div className="absolute top-2/3 right-1/3 w-10 h-10 rounded-2xl bg-primary/4 dark:bg-primary/6 rotate-45 blur-sm" />
      <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-accent/4 dark:bg-accent/6 blur-sm" />
      <div className="absolute bottom-1/4 right-1/5 w-12 h-12 rounded-2xl bg-accent/4 dark:bg-accent/6 -rotate-12 blur-sm" /> */}

      {/* SVG Gradients definitions */}
      {/* <svg className="absolute w-0 h-0">
        <defs>
          <radialGradient id="gradientPrimary" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradientAccent" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gradientMixed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg> */}
    </div>
  );
};

export default FloatingShapes;

