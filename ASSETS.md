# Brand & photography assets

The marketing site renders on-brand **placeholders** until you drop in the real
artwork. Every image is referenced from one file — `src/lib/siteImages.ts` — so
swapping a placeholder for a real photo is a one-line change.

## 1. Logo

Drop your logo here:

```
magicmail/public/logo.png
```

- Used in the top nav (≈40px tall) and footer (≈48px tall).
- A transparent background works best (it sits on dark green **and** cream).
- If the file is missing, the header falls back to a crafted badge + wordmark,
  so nothing ever looks broken.

## 2. Photography

Drop files in `magicmail/public/photos/`, then point each slot in
`src/lib/siteImages.ts` at your file (e.g. change `"/photos/_placeholder-hero.svg"`
to `"/photos/hero.jpg"`).

| Slot | Suggested file | Subject | Size (approx) |
|------|----------------|---------|----------------|
| `hero` | `hero.jpg` | A child writing / reading a letter by the tree, warm candlelight | 1000×1200 (5:6 portrait) |
| `occasions` | `occasions.jpg` | Cozy, snowy, quiet winter scene (used as a darkened band) | 1600×900 (16:9) |
| `craft` | `craft.jpg` | Close-up of a letter being hand-penned in ink | 1200×900 (4:3) |

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
