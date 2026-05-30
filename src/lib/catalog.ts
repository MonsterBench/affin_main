import type { GiftProduct } from "./types";

// The Kringle gift catalog. Santa letters are the flagship; the rest of the
// catalog extends the brand into year-round and corporate gifting.
export const CATALOG: GiftProduct[] = [
  {
    id: "santa-letter-deluxe",
    name: "Deluxe Santa Letter",
    category: "letter",
    tier: "deluxe",
    price: 49,
    cost: 11,
    emoji: "🎅",
    blurb:
      "Hand-penned letter from Santa on aged parchment with a North Pole postmark, nice-list certificate, and a pinch of magic snow.",
    occasions: ["holiday"],
    handwritten: true,
    popular: true,
  },
  {
    id: "santa-letter-classic",
    name: "Classic Santa Letter",
    category: "letter",
    tier: "signature",
    price: 24,
    cost: 5,
    emoji: "✉️",
    blurb:
      "A warm, personalized letter from Santa naming the child, their hometown, and one thing they're hoping for.",
    occasions: ["holiday"],
    handwritten: true,
  },
  {
    id: "winter-wonder-box",
    name: "Winter Wonder Box",
    category: "giftbox",
    tier: "deluxe",
    price: 89,
    cost: 34,
    emoji: "🎁",
    blurb:
      "Cocoa flight, hand-dipped marshmallows, a wool throw, and a handwritten card — the flagship Q4 keepsake box.",
    occasions: ["holiday", "thank_you", "just_because"],
    handwritten: true,
    popular: true,
  },
  {
    id: "fresh-start-box",
    name: "Fresh Start Box",
    category: "giftbox",
    tier: "signature",
    price: 64,
    cost: 24,
    emoji: "🌱",
    blurb:
      "A January–March favorite: artisan tea, a linen-bound journal, and a candle to welcome a new year, home, or chapter.",
    occasions: ["new_client", "milestone", "just_because"],
    handwritten: true,
  },
  {
    id: "welcome-home-box",
    name: "Welcome Home Box",
    category: "giftbox",
    tier: "deluxe",
    price: 119,
    cost: 46,
    emoji: "🏡",
    blurb:
      "The real-estate closing classic: local treats, a cheese board, and a handwritten note — all credit goes to you.",
    occasions: ["closing", "new_client"],
    handwritten: true,
    popular: true,
  },
  {
    id: "sunshine-box",
    name: "Sunshine Box",
    category: "giftbox",
    tier: "signature",
    price: 58,
    cost: 21,
    emoji: "🌻",
    blurb:
      "A bright Q2–Q3 box: citrus shortbread, a beach towel, and SPF — built for summer birthdays and milestones.",
    occasions: ["birthday", "milestone", "just_because"],
    handwritten: true,
  },
  {
    id: "celebration-treats",
    name: "Celebration Treats",
    category: "treat",
    tier: "signature",
    price: 38,
    cost: 14,
    emoji: "🧁",
    blurb:
      "A dozen hand-decorated cookies and a candle, with a handwritten note tucked inside the ribbon.",
    occasions: ["birthday", "work_anniversary", "milestone"],
    handwritten: true,
  },
  {
    id: "gratitude-card",
    name: "Gratitude Card",
    category: "card",
    tier: "essential",
    price: 9,
    cost: 2,
    emoji: "💌",
    blurb:
      "A robot-penned card in real ballpoint ink — indistinguishable from handwriting, mailed with a real stamp.",
    occasions: ["thank_you", "new_client", "just_because"],
    handwritten: true,
  },
  {
    id: "milestone-keepsake",
    name: "Milestone Keepsake",
    category: "keepsake",
    tier: "deluxe",
    price: 74,
    cost: 28,
    emoji: "🏆",
    blurb:
      "An engraved brass ornament and a handwritten note marking an anniversary, promotion, or big win.",
    occasions: ["work_anniversary", "milestone"],
    handwritten: true,
  },
];

export function getProduct(id: string): GiftProduct | undefined {
  return CATALOG.find((p) => p.id === id);
}
