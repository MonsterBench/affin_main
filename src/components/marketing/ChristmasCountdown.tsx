"use client";

import { useEffect, useState } from "react";

// Christmas-aware countdown. During the shipping window it nudges urgency
// ("order by the deadline"); the rest of the year it stays warm and on-brand,
// since Kris Kringle Mail now sends a little magic year-round.
const SHIP_DEADLINE_MONTH = 11; // December (0-indexed)
const SHIP_DEADLINE_DAY = 18; // order-by date for guaranteed Christmas delivery

function nextChristmas(now: Date): Date {
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 11, 25);
}

function shipDeadline(now: Date): Date {
  const xmas = nextChristmas(now);
  return new Date(xmas.getFullYear(), SHIP_DEADLINE_MONTH, SHIP_DEADLINE_DAY, 23, 59, 59);
}

function daysBetween(a: Date, b: Date): number {
  return Math.ceil((b.getTime() - a.getTime()) / 86_400_000);
}

export function ChristmasCountdown() {
  // Avoid hydration mismatch: render nothing until mounted on the client.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Deferred (async) sets avoid synchronous setState during the effect while
    // still skipping server render, which keeps hydration clean.
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (!now) {
    return <div className="h-12" aria-hidden />;
  }

  const xmas = nextChristmas(now);
  const deadline = shipDeadline(now);
  const daysToXmas = Math.max(0, daysBetween(now, xmas));
  const daysToDeadline = daysBetween(now, deadline);

  // In-season urgency: deadline is approaching within the next ~7 weeks.
  const urgent = daysToDeadline >= 0 && daysToDeadline <= 50;

  if (urgent) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-berry-500/15 px-5 py-2.5 text-sm font-semibold text-berry-600 ring-1 ring-berry-500/30">
        <span>🎄 Order by Dec 18 for guaranteed Christmas delivery</span>
        <span className="text-berry-500/80">
          · {daysToDeadline === 0 ? "last day!" : `${daysToDeadline} day${daysToDeadline === 1 ? "" : "s"} left`}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-pine-50 px-5 py-2.5 text-sm font-medium text-pine-700 ring-1 ring-pine-100">
      <span>✨ {daysToXmas} days until Christmas</span>
      <span className="text-pine-400">·</span>
      <span className="text-pine-500">Santa&apos;s mailbox is open all year</span>
    </div>
  );
}
