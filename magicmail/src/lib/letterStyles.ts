// Curated letter "looks" the customer can choose for their Santa letter.
// Each preset pairs a handwriting style with stationery. The visual fields here
// are brand-controlled (so the gallery always works); the mapping to a real
// fulfillment provider's card/font IDs lives server-side in handwriting.ts.

export interface LetterStyle {
  id: string;
  name: string;
  handwriting: string; // human-readable handwriting style
  blurb: string;
  emoji: string;
  // Preview swatch colors (paper + ink) for the gallery card.
  paper: string;
  ink: string;
}

export const LETTER_STYLES: LetterStyle[] = [
  {
    id: "north-pole-classic",
    name: "North Pole Classic",
    handwriting: "Santa's flowing script",
    blurb: "Warm cream parchment with a classic, jolly hand. The timeless Santa letter.",
    emoji: "🎅",
    paper: "#f4ecdd",
    ink: "#7d201d",
  },
  {
    id: "candy-cane",
    name: "Candy Cane",
    handwriting: "Playful print",
    blurb: "Bright and festive with a fun, bouncy print — a favorite with little ones.",
    emoji: "🍬",
    paper: "#fff6f6",
    ink: "#c0392b",
  },
  {
    id: "starry-night",
    name: "Starry Night",
    handwriting: "Elegant cursive",
    blurb: "Deep midnight blue with gold accents and a graceful, magical cursive.",
    emoji: "🌟",
    paper: "#eef2f8",
    ink: "#1f3a5f",
  },
  {
    id: "cozy-cabin",
    name: "Cozy Cabin",
    handwriting: "Friendly handwriting",
    blurb: "Warm kraft paper with a relaxed, friendly hand — cozy as cocoa by the fire.",
    emoji: "🪵",
    paper: "#efe3d2",
    ink: "#5b3a1e",
  },
  {
    id: "winter-wonderland",
    name: "Winter Wonderland",
    handwriting: "Neat script",
    blurb: "Crisp icy white with silver snowflakes and a tidy, elegant script.",
    emoji: "❄️",
    paper: "#f3f7fb",
    ink: "#2c6b6b",
  },
];

export const DEFAULT_STYLE_ID = "north-pole-classic";

export function getLetterStyle(id?: string | null): LetterStyle {
  return LETTER_STYLES.find((s) => s.id === id) ?? LETTER_STYLES[0];
}
