export function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Deterministic "busy" pattern so a day always looks the same to everyone. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function slotsFor(date: Date) {
  const day = date.getDay();
  const start = day === 0 ? 10 * 60 : day === 6 ? 9 * 60 : 8 * 60 + 30;
  const end = day === 0 ? 15 * 60 : day === 6 ? 17 * 60 : 19 * 60;

  // An hour that has already passed today must never be bookable.
  const now = new Date();
  const isToday = ymd(now) === ymd(date);
  const cutoff = isToday ? now.getHours() * 60 + now.getMinutes() + 60 : -1;

  const out: { time: string; free: boolean }[] = [];
  for (let m = start; m <= end; m += 30) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    out.push({ time, free: m > cutoff && hash(ymd(date) + time) % 10 > 3 });
  }
  return out;
}

/** The next day that still has room, and its first free hours. */
export function nextAvailability(count = 3) {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const free = slotsFor(d).filter((s) => s.free).map((s) => s.time);
    if (free.length) {
      return {
        date: d,
        label: i === 0 ? "днес" : i === 1 ? "утре" : null,
        times: free.slice(0, count),
      };
    }
  }
  return null;
}
