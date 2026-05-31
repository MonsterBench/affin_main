# Brand & photography assets

The marketing site renders on-brand **placeholders** until you drop in the real
artwork. Every image is referenced from one file — `src/lib/siteImages.ts` — so
swapping a placeholder for a real photo is a one-line change.

## 1. Logo

Export each variant as a **transparent PNG** and drop them in
`magicmail/public/brand/`:

| File | Variant | Used where |
|------|---------|------------|
| `logo-icon.png` | Red wax-seal **KK** | Top nav (paired with a cream wordmark — reads on the dark green header) |
| `logo-primary.png` | Envelope + stacked wordmark | Footer (light background) |
| `logo-horizontal.png` | Envelope + horizontal wordmark | Optional alternate lockup |
| `logo-stamp.png` | Circular postal stamp | Optional decorative / keepsake accent |

Why split it up: the full logo's green **MAIL** would disappear on the dark
green nav, so the nav uses the standalone wax-seal icon + a cream text wordmark,
while the footer (cream background) uses the full primary lockup.

If any file is missing, the `Logo` component falls back to a crafted badge so
nothing ever looks broken.

### Favicon / app icon
Drop the wax-seal as `magicmail/src/app/icon.png` (512×512) and Next.js will use
it as the browser tab icon automatically.

## 2. Photography

Drop files in `magicmail/public/photos/`, then point each slot in
`src/lib/siteImages.ts` at your file (e.g. change `"/photos/_placeholder-hero.svg"`
to `"/photos/hero.jpg"`).

| Slot | Suggested file | Subject | Size (approx) |
|------|----------------|---------|----------------|
| `hero` | `hero.jpg` | Santa hand-penning a "Dear Emma" letter by lantern light | 1200×900 (4:3) |
| `families` | `families.jpg` | A mom and kids delighted by a letter from Santa | 1200×900 |
| `business` | `business.jpg` | A person writing a handwritten note at a cozy desk | 1200×900 |
| `giftbox` | `giftbox.jpg` | The red North Pole gift box with letter + treats | 1200×1000 |
| `keepsake` | `keepsake.jpg` | Addressed envelope beside an official Nice List certificate (wide) | 1680×720 (21:9) |

> The four photos you shared map directly: Santa-writing → `hero`, mom+kids → `families`,
> man-at-desk → `business`, red gift box → `giftbox`. The `keepsake` (envelope + certificate)
> slot still needs a photo.

### Free, commercially-usable sources
Search these for the subjects above (all allow commercial use; check each
photo's license and add attribution where requested):

- **Unsplash** — https://unsplash.com/s/photos/child-writing-letter-to-santa
- **Pexels** — https://www.pexels.com/search/child%20christmas%20letter/
- **Pixabay** — https://pixabay.com/images/search/letter%20to%20santa/

> Tip: prefer warm, candid, slightly imperfect shots over polished studio stock —
> they read as authentic rather than generic.

### Optimizing
Export as **WebP** (or compressed JPG, ~80% quality) and keep each file under
~300 KB for fast loads. The slots use `object-cover`, so exact dimensions aren't
critical — just match the rough aspect ratio above.
