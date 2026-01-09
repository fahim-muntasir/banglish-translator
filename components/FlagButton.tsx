const FlagButton = () => {
  return (
    <button
      className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg hover:scale-105 transition-all duration-300 group"
      aria-label="Country flag"
    >
      {/* SVG Flag */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-5 h-5 transition-transform duration-300"
      >
        <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#2d694f"></rect>
        <circle cx="16" cy="16" r="7" fill="#e13e47"></circle>
      </svg>
    </button>
  );
};

export default FlagButton;
