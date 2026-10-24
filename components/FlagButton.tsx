const FlagButton = () => (
  <button className="nb-chip fixed top-4 left-4 z-50 p-3 group" aria-label="Bangladesh Flag - Language indicator">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true" focusable="false">
      <rect x="1" y="4" width="30" height="24" fill="#2d694f" />
      <circle cx="16" cy="16" r="7" fill="#e13e47" />
    </svg>
    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-secondary text-[#111] text-xs font-black border-[3px] border-ink opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      Bangladesh
    </span>
  </button>
);
export default FlagButton;