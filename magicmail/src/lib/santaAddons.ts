// Optional paid extras for a Santa letter. Prices live server-side so the
// checkout route can validate them — the client only ever sends add-on ids.
// Kept free of server-only imports so it can be used in client components too.

export interface SantaAddon {
  id: string;
  label: string;
  emoji: string;
  price: number; // USD
  blurb: string;
}

export const SANTA_ADDONS: SantaAddon[] = [
  {
    id: "reindeer-food",
    label: "Magic Reindeer Food",
    emoji: "🦌",
    price: 8,
    blurb: "A packet of oats and sparkle to leave out on Christmas Eve.",
  },
  {
    id: "sibling-shoutout",
    label: "Sibling Shout-Out",
    emoji: "👧",
    price: 6,
    blurb: "Santa greets a brother, sister, or friend by name in the letter.",
  },
  {
    id: "keepsake-box",
    label: "Keepsake Gift Box",
    emoji: "🎁",
    price: 12,
    blurb: "Your letter arrives nestled in a North Pole keepsake box.",
  },
  {
    id: "priority-shipping",
    label: "Priority North Pole Shipping",
    emoji: "⚡",
    price: 9,
    blurb: "Bumps your letter to the front of Santa's mailbag.",
  },
];

export function getSantaAddon(id: string): SantaAddon | undefined {
  return SANTA_ADDONS.find((a) => a.id === id);
}

// Validates raw client input into known add-ons (dedupes, drops unknown ids).
export function resolveSantaAddons(ids: unknown): SantaAddon[] {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const out: SantaAddon[] = [];
  for (const raw of ids) {
    const addon = getSantaAddon(String(raw));
    if (addon && !seen.has(addon.id)) {
      seen.add(addon.id);
      out.push(addon);
    }
  }
  return out;
}

// Santa letter tiers offered in the consumer creator (subset of the catalog).
export const SANTA_TIERS = [
  {
    id: "santa-letter-classic",
    name: "Classic",
    price: 24,
    perks: ["Personalized letter in real ink", "North Pole postmark", "Magic keepsake QR page"],
  },
  {
    id: "santa-letter-deluxe",
    name: "Deluxe",
    price: 49,
    perks: ["Everything in Classic", "Aged-parchment letter", "Official Nice List certificate", "A pinch of magic snow"],
    popular: true,
  },
] as const;
