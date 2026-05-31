// ----------------------------------------------------------------------------
// Central image manifest. Every photo on the marketing site is referenced from
// here, so swapping placeholders for real photography is a one-line change.
//
// To use your own photo:
//   1. Drop the file in  magicmail/public/photos/  (e.g. hero.jpg)
//   2. Point the value below at it, e.g.  hero: "/photos/hero.jpg"
//
// Until then, on-brand placeholders render so nothing looks broken. See
// magicmail/ASSETS.md for the recommended subject, dimensions, and free
// sources (Unsplash / Pexels / Pixabay) for each slot.
// ----------------------------------------------------------------------------

export const PHOTOS = {
  // Hero — a child writing/reading a letter by the tree, warm candle light.
  hero: "/photos/_placeholder-hero.svg",
  // Wide band behind the "all year round" section — cozy, snowy, quiet.
  occasions: "/photos/_placeholder-occasions.svg",
  // Close-up of a letter being hand-penned in ink (the "real ink" proof).
  craft: "/photos/_placeholder-craft.svg",
} as const;

// Your brand logo. Drop the PNG at magicmail/public/logo.png. If it's missing,
// the Logo component falls back to a crafted badge so the nav never breaks.
export const LOGO_SRC = "/logo.png";
