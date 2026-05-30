export function currency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
}

export function shortDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function longDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function initials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

// Days from `today` until the next occurrence of a recurring (month/day) date.
export function daysUntilRecurring(iso: string, from = new Date()): number {
  const target = new Date(iso + "T00:00:00");
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let next = new Date(today.getFullYear(), target.getMonth(), target.getDate());
  if (next < today) next = new Date(today.getFullYear() + 1, target.getMonth(), target.getDate());
  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}
