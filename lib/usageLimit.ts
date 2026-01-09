const MAX_DAILY_LIMIT = 4;

export function canUserConvert(): boolean {
  if (typeof window === "undefined") return false;

  const today = new Date().toDateString();

  const savedDate = localStorage.getItem("banglish_date");
  const savedCount = Number(localStorage.getItem("banglish_count") || 0);

  if (savedDate !== today) {
    localStorage.setItem("banglish_date", today);
    localStorage.setItem("banglish_count", "0");
    return true;
  }

  return savedCount < MAX_DAILY_LIMIT;
}

export function increaseUsage(): void {
  if (typeof window === "undefined") return;

  const count = Number(localStorage.getItem("banglish_count") || 0);
  localStorage.setItem("banglish_count", String(count + 1));
}

export function getRemainingUsage(): number {
  if (typeof window === "undefined") return MAX_DAILY_LIMIT;

  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("banglish_date");

  if (savedDate !== today) return MAX_DAILY_LIMIT;

  const used = Number(localStorage.getItem("banglish_count") || 0);
  return Math.max(0, MAX_DAILY_LIMIT - used);
}

export { MAX_DAILY_LIMIT };
