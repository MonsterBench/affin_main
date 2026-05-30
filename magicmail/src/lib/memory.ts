import "server-only";
import { listRecipients, listSends } from "./db";
import { getProduct } from "./catalog";
import { OCCASION_LABELS, type OccasionType } from "./types";
import { daysUntilRecurring } from "./format";

// Memory Keeper — turns the platform's own send history into proactive
// "send a thoughtful moment now" suggestions. This is the differentiator:
// competitors automate rules; this automates thoughtfulness itself.

export interface Suggestion {
  recipientId: string;
  recipientName: string;
  occasion: OccasionType;
  reason: string; // why we're surfacing this, human-readable
  date?: string; // the relevant ISO date (upcoming occasion), if any
  daysAway?: number; // days until that date
  priority: number; // higher = surface first
  suggestedGiftId: string;
}

const GIFT_FOR_OCCASION: Record<OccasionType, string> = {
  holiday: "santa-letter-deluxe",
  birthday: "celebration-treats",
  work_anniversary: "milestone-keepsake",
  closing: "welcome-home-box",
  new_client: "fresh-start-box",
  milestone: "milestone-keepsake",
  thank_you: "gratitude-card",
  just_because: "sunshine-box",
};

const UPCOMING_WINDOW_DAYS = 45;
const STALE_AFTER_DAYS = 120; // "you haven't reached out in a while"

function daysBetween(aIso: string, bIso: string): number {
  const a = new Date(aIso + "T00:00:00").getTime();
  const b = new Date(bIso + "T00:00:00").getTime();
  return Math.round((b - a) / 86_400_000);
}

export async function getSuggestions(userId: string, limit = 6): Promise<Suggestion[]> {
  const [recipients, sends] = await Promise.all([listRecipients(userId), listSends(userId)]);
  const today = new Date().toISOString().slice(0, 10);

  // Latest non-skipped send per recipient (for staleness).
  const lastSendByRecipient = new Map<string, string>();
  for (const s of sends) {
    if (s.status === "skipped") continue;
    const cur = lastSendByRecipient.get(s.recipientId);
    if (!cur || s.scheduledFor > cur) lastSendByRecipient.set(s.recipientId, s.scheduledFor);
  }

  // Open (scheduled/in-flight) sends per recipient+occasion, so we don't
  // suggest something already in motion.
  const openKey = new Set<string>();
  for (const s of sends) {
    if (s.status === "delivered" || s.status === "skipped") continue;
    openKey.add(`${s.recipientId}:${s.occasion}`);
  }

  const out: Suggestion[] = [];

  for (const r of recipients) {
    const name = `${r.firstName} ${r.lastName}`;

    // 1) Upcoming important dates.
    for (const d of r.importantDates) {
      const away = daysUntilRecurring(d.date);
      if (away < 0 || away > UPCOMING_WINDOW_DAYS) continue;
      if (openKey.has(`${r.id}:${d.occasion}`)) continue;
      const gift = GIFT_FOR_OCCASION[d.occasion] ?? "sunshine-box";
      // Closer dates rank higher; lead time matters most inside ~2 weeks.
      const priority = 100 - away + (away <= 14 ? 20 : 0);
      out.push({
        recipientId: r.id,
        recipientName: name,
        occasion: d.occasion,
        reason:
          away === 0
            ? `${OCCASION_LABELS[d.occasion]} is today`
            : `${OCCASION_LABELS[d.occasion]} in ${away} day${away === 1 ? "" : "s"}`,
        date: d.date,
        daysAway: away,
        priority,
        suggestedGiftId: gift,
      });
    }

    // 2) Staleness — haven't reached out in a long time (clients/employees only;
    // not kids, whose touches are date-driven).
    if (r.audience === "client" || r.audience === "employee" || r.audience === "prospect") {
      const last = lastSendByRecipient.get(r.id);
      const sinceDays = last ? daysBetween(last, today) : daysBetween(r.createdAt, today);
      if (sinceDays >= STALE_AFTER_DAYS && !openKey.has(`${r.id}:just_because`)) {
        const months = Math.round(sinceDays / 30);
        out.push({
          recipientId: r.id,
          recipientName: name,
          occasion: "just_because",
          reason: last
            ? `It's been ${months} months since you last reached out`
            : `You've never sent ${r.firstName} a thing yet`,
          priority: 40 + Math.min(sinceDays / 30, 20),
          suggestedGiftId: "sunshine-box",
        });
      }
    }
  }

  // Highest priority first; keep one suggestion per recipient (the top one).
  out.sort((a, b) => b.priority - a.priority);
  const seen = new Set<string>();
  const deduped = out.filter((s) => (seen.has(s.recipientId) ? false : (seen.add(s.recipientId), true)));
  return deduped.slice(0, limit).map((s) => ({
    ...s,
    // attach a friendly gift name into reason context via product lookup is done in UI
  }));
}

export function giftName(giftId: string): string {
  return getProduct(giftId)?.name ?? "a gift";
}
