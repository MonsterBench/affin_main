// ----------------------------------------------------------------------------
// Central image manifest. Every photo/logo on the marketing site is referenced
// from here, so swapping placeholders for real artwork is a one-line change.
//
// To use your own photo:
//   1. Drop the file in  magicmail/public/photos/  (e.g. hero.jpg)
//   2. Point the value below at it, e.g.  hero: "/photos/hero.jpg"
//
// Until then, on-brand placeholders render so nothing looks broken. See
// magicmail/ASSETS.md for the recommended subject, dimensions, free sources
// (Unsplash / Pexels / Pixabay), and which logo variant goes where.
// ----------------------------------------------------------------------------

export const PHOTOS = {
  // Hero — a child writing/reading a letter by the tree, warm candle light.
  hero: "/photos/_placeholder-hero.svg",
  // Wide band behind the "all year round" section — cozy, snowy, quiet.
  occasions: "/photos/_placeholder-occasions.svg",
  // Close-up of a letter being hand-penned in ink (the "real ink" proof).
  craft: "/photos/_placeholder-craft.svg",
} as const;

// Brand logo variants. Drop the PNGs (transparent background) in
// magicmail/public/brand/. If a file is missing, the Logo component falls back
// to a crafted badge so the header never shows a broken image.
//   - icon:       red wax-seal "KK" — used in the dark nav (reads on any bg)
//   - horizontal: envelope + wordmark — compact lockup
//   - primary:    envelope + stacked wordmark — used in the (light) footer
//   - stamp:      circular postal stamp — decorative / keepsake accent
export const LOGOS = {
  icon: "/brand/logo-icon.png",
  horizontal: "/brand/logo-horizontal.png",
  primary: "/brand/logo-primary.png",
  stamp: "/brand/logo-stamp.png",
} as const;
