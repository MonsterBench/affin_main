// ----------------------------------------------------------------------------
// Central image manifest. Every photo/logo on the marketing site is referenced
// from here, so swapping placeholders for real artwork is a one-line change.
//
// To use a photo: drop the file in magicmail/public/photos/ and point the slot
// below at it, e.g.  hero: "/photos/hero.jpg". On-brand placeholders render
// until then. See magicmail/ASSETS.md for the subject + which photo goes where.
// ----------------------------------------------------------------------------

export const PHOTOS = {
  // Hero — Santa hand-penning a "Dear Emma" letter by lantern light.
  hero: "/photos/_placeholder-hero.svg",
  // "For Families" card — a mom and kids delighted by a letter.
  families: "/photos/_placeholder-families.svg",
  // "For Businesses" card — a person writing a note at a cozy desk.
  business: "/photos/_placeholder-business.svg",
  // "Magic Mail Club" card + gift collection — the red North Pole gift box.
  giftbox: "/photos/_placeholder-giftbox.svg",
  // "How it works" detail — addressed envelope + Nice List certificate.
  keepsake: "/photos/_placeholder-keepsake.svg",
} as const;

// Brand logo variants. Drop the PNGs (transparent background) in
// magicmail/public/brand/. Missing files fall back to a crafted badge.
//   - icon:       red wax-seal "KK" — used in the dark nav (reads on any bg)
//   - horizontal: envelope + wordmark — compact lockup
//   - primary:    envelope + stacked wordmark — used on light backgrounds
//   - stamp:      circular postal stamp — decorative / keepsake accent
export const LOGOS = {
  icon: "/brand/logo-icon.png",
  horizontal: "/brand/logo-horizontal.png",
  primary: "/brand/logo-primary.png",
  stamp: "/brand/logo-stamp.png",
} as const;
