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
| Send pipeline | `/dashboard/sends` | Per-touch controls: **skip / delay / expedite / pause / resume** + advance through fulfillment. **✨ AI-written notes**. |
| Fulfillment | `/dashboard/fulfillment` | Operator backend: every order with mailing address + AI note, **send-to-auto-pen**, and **CSV export** |
| Gift catalog | `/dashboard/catalog` | Curated products with tiers, occasions, and margins |
| Integrations | `/dashboard/integrations` | **CRM / Zapier** inbound webhook + API key so events auto-schedule gifts |
| Billing | `/dashboard/billing` | Subscription plans via **Stripe** (Checkout + Customer Portal), with a demo mode |
| Send a gift | `/gift` | **Public one-off consumer checkout** — no login; pick a gift, AI note, Stripe payment |

The **auto-send scheduler** (`src/lib/scheduler.ts`) mirrors Client Giant: it keeps the next recurring touch queued (quarterly aligns to the Top-of-Mind months Mar/Jun/Sep/Dec), emails a heads-up before each send, and auto-releases due sends into fulfillment. Run it via `POST /api/cron/run` (a daily cron, protected by `CRON_SECRET`) or the in-app **Run scheduler** button.

Automations support a **recurring cadence** (one-time / monthly / quarterly / annually) — quarterly powers a "Top of Mind" program. Auth includes **email verification** and **password reset** (dev mode logs the link when no email provider is set).

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

**Deploying?** See [DEPLOY.md](./DEPLOY.md) — one-platform setup on Railway (app +
Postgres, or app + SQLite volume), or Vercel + Railway Postgres. The Prisma adapter
auto-selects Postgres vs SQLite from `DATABASE_URL`.

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

## AI, handwriting & fulfillment

- **AI notes** (`src/lib/ai.ts`) — Claude writes occasion-aware notes (Santa voice for
  holidays); falls back to themed templates without `ANTHROPIC_API_KEY`.
- **Handwriting/auto-pen** (`src/lib/handwriting.ts`) — a provider-agnostic layer with
  adapters for **Handwrytten** (robotic-pen API), **AxiDraw** (in-house pen plotter), or
  **manual** operator queue. Set `HANDWRITING_PROVIDER`.
- **Fulfillment** captures full mailing addresses and exposes a production queue + CSV
  export — the hand-off to an operator, 3PL, or the pen provider.

## Integrations (CRM / Zapier)

Each account gets an API key. CRMs or Zapier `POST` to `/api/integrations/trigger`
with an event (e.g. `closing`) and contact details; we upsert the recipient and fire
any matching active automation. See the in-app Integrations page for the exact payload.

## Roadmap ideas

- Native one-click CRM connectors (Follow Up Boss, HubSpot, Salesforce)
- Recurring cadence scheduler (cron) to auto-create the next touch
- Delivery notifications + live shipment tracking
- Team seats & roles, white‑label branding
