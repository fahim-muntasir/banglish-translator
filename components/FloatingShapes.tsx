const FloatingShapes = () => {
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10" 
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-30 dark:opacity-15 will-change-transform animate-pulse-slow"
        viewBox="0 0 1000 1000"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Group 1: Primary Color (Thickest) */}
        <path
          d="M0 0 L0 1000 M150 0 L150 1000 M300 0 L300 1000 M450 0 L450 1000 M600 0 L600 1000 M750 0 L750 1000 M900 0 L900 1000"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />

        {/* Group 2: Accent Color (Medium) - FIXED LINE COORDINATE */}
        <path
          d="M50 0 L50 1000 M200 0 L200 1000 M350 0 L350 1000 M500 0 L500 1000 M650 0 L650 1000 M800 0 L800 1000 M950 0 L950 1000"
          stroke="hsl(var(--accent))"
          strokeWidth="0.8"
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />

        {/* Group 3: Primary Color (Thinnest) */}
        <path
          d="M100 0 L100 1000 M250 0 L250 1000 M400 0 L400 1000 M550 0 L550 1000 M700 0 L700 1000 M850 0 L850 1000"
          stroke="hsl(var(--primary))"
          strokeWidth="0.6"
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default FloatingShapes;