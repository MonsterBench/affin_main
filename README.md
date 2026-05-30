# Kringle — Magic Mail & Gifting Platform

The SaaS platform behind **Kris Kringle Mail**: handwritten Santa letters, year‑round
gift boxes, and corporate appreciation, sent automatically at the moments that matter.

This is an MVP that turns the "Client Giant, but better" idea into working software —
a marketing site plus a real product dashboard for managing recipients, occasion‑based
automations, a gift catalog, and a send/fulfillment pipeline.

## What's inside

| Area | Route | Notes |
| --- | --- | --- |
| Marketing site | `/` | Hero, how‑it‑works, gift collection, B2B section, pricing, waitlist |
| Overview | `/dashboard` | KPIs, upcoming sends, pipeline + automation snapshot |
| Recipients | `/dashboard/recipients` | Contact list with audiences, tags, occasions; add via modal |
| Automations | `/dashboard/automations` | Trigger → gift rules (e.g. *Christmas Eve Santa letters*); toggle on/off, create new |
| Send pipeline | `/dashboard/sends` | Each gift from `scheduled → handwriting → assembling → shipped → delivered`; advance stages |
| Gift catalog | `/dashboard/catalog` | Curated products with tiers, occasions, and margins |

## Tech

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a custom evergreen / gold / parchment design system
- REST‑style **Route Handlers** under `/api/*`
- An in‑memory store (`src/lib/store.ts`) seeded with demo data — swap for a real
  database (Postgres/Prisma) without touching the UI or API contracts.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Architecture

```
src/
  app/
    page.tsx              Marketing landing page (static)
    dashboard/            Product UI (force-dynamic — reads the live store)
    api/                  Route handlers: recipients, automations, sends, metrics
  components/
    dashboard/            Sidebar, managers, modals (client components)
    ui/                   Badges, modal primitive
  lib/
    types.ts              Domain model
    catalog.ts            Gift catalog
    store.ts              In-memory data + CRUD (seed lives here)
    metrics.ts            Dashboard KPI computation
    format.ts             Currency/date helpers
```

Mutations go through the API and the dashboard pages re‑render via
`router.refresh()`, keeping a clean client → API → store flow that's ready to
graduate to a real backend.

## Roadmap ideas

- Real auth + multi‑tenant accounts
- Postgres + Prisma persistence
- Stripe billing for the subscription tiers
- CRM sync (Follow Up Boss, HubSpot) and Zapier triggers
- Auto‑pen / fulfillment partner integration and live shipment tracking
