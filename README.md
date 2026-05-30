# Kringle — Magic Mail & Gifting Platform

The SaaS platform behind **Kris Kringle Mail**: handwritten Santa letters, year‑round
gift boxes, and corporate appreciation, sent automatically at the moments that matter.

This is an MVP that turns the "Client Giant, but better" idea into working software —
a marketing site plus a real product dashboard for managing recipients, occasion‑based
automations, a gift catalog, and a send/fulfillment pipeline.

## What's inside

| Area | Route | Notes |
| --- | --- | --- |
| Marketing site | `/` | Hero, how‑it‑works, gift collection, B2B section, pricing, **working waitlist** |
| Sign up / in | `/signup`, `/login` | Email + password auth; new accounts are auto‑seeded with sample data |
| Overview | `/dashboard` | KPIs, upcoming sends, pipeline + automation snapshot |
| Recipients | `/dashboard/recipients` | Contact list with audiences, tags, occasions; add via modal |
| Automations | `/dashboard/automations` | Trigger → gift rules (e.g. *Christmas Eve Santa letters*); toggle on/off, create new |
| Send pipeline | `/dashboard/sends` | Each gift from `scheduled → handwriting → assembling → shipped → delivered`; advance stages |
| Gift catalog | `/dashboard/catalog` | Curated products with tiers, occasions, and margins |
| Billing | `/dashboard/billing` | Subscription plans via **Stripe** (Checkout + Customer Portal), with a demo mode |

## Tech

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a custom evergreen / gold / parchment design system
- **Prisma 7** + **SQLite** (better‑sqlite3 driver adapter) — schema is Postgres‑ready
- **Auth**: bcrypt password hashing + signed‑JWT session cookies (`jose`), multi‑tenant by `userId`
- **Stripe** subscriptions with webhook → plan sync. Runs in **demo mode** when no keys are set, so upgrades are fully clickable locally
- REST‑style **Route Handlers** under `/api/*`

## Develop

```bash
npm install            # also runs `prisma generate`
cp .env.example .env   # SQLite works out of the box
npm run db:push        # create the SQLite schema
npm run db:seed        # create the demo account + sample data
npm run dev            # http://localhost:3000
```

### Demo login

```
demo@kriskringlemail.com  /  magicmail
```

(or create your own account at `/signup` — it gets seeded with sample data too).

### Enabling live Stripe billing

Set these in `.env` (leave blank for demo mode):

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=price_...
```

## Architecture

```
prisma/
  schema.prisma           Data model (User, Recipient, ImportantDate, Automation, Send, WaitlistEntry)
  seed.ts                 Creates the demo account
src/
  app/
    page.tsx              Marketing landing page
    login/, signup/       Auth pages
    actions/auth.ts       signup / login / logout server actions
    dashboard/            Product UI (force-dynamic — reads the live DB, scoped by user)
    api/                  Route handlers: recipients, automations, sends, metrics, waitlist, billing/*
  components/
    auth/                 Auth form + split-screen shell
    dashboard/            Sidebar, managers, modals, billing plans (client components)
    marketing/            Waitlist form
    ui/                   Badges, modal primitive
  lib/
    types.ts              Domain model + labels
    catalog.ts            Gift catalog (static)
    plans.ts              Subscription plan definitions
    prisma.ts             PrismaClient (better-sqlite3 adapter) singleton
    db.ts                 Data access layer (async, user-scoped) + metrics
    auth.ts / session.ts  Password hashing + signed-cookie sessions
    seed-user.ts          Seeds sample data for an account
    stripe.ts             Stripe client + live/demo detection
    format.ts             Currency/date helpers
```

Mutations go through the API (or server actions), and dashboard pages re‑render
via `router.refresh()`, keeping a clean client → API → DB flow. Everything is
scoped to the authenticated `userId` for multi‑tenant safety.

### Switching to Postgres

Change the `datasource` provider in `schema.prisma` to `postgresql`, swap the
adapter in `src/lib/prisma.ts` for `@prisma/adapter-pg`, set `DATABASE_URL`, and
run `prisma db push`. No UI or API changes required.

## Roadmap ideas

- CRM sync (Follow Up Boss, HubSpot) and Zapier triggers
- Real email (magic links, delivery notifications)
- Auto‑pen / fulfillment partner integration and live shipment tracking
- Team seats & roles, white‑label branding
