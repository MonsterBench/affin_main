# Deploying Kringle

Kringle is a single Next.js app — the **frontend and backend are one deployable**
(pages + `/api` route handlers + the scheduler). You deploy one service, plus a
database.

## Recommended: all on Railway

Railway can host the app **and** the database, so everything lives on one platform
with one bill. Two database choices:

### Option A — Railway + Postgres (recommended for a real, scaling SaaS)

1. **Create the app service**
   - New Project → *Deploy from GitHub repo* → pick this repo.
   - Set the service **root directory** to `magicmail/` (the app isn't at the repo root).
   - Railway auto-detects Next.js (Nixpacks). `railway.json` already sets the
     start and pre-deploy (schema sync) commands.
2. **Add Postgres**
   - In the project: *New → Database → PostgreSQL*. Railway creates a
     `DATABASE_URL` you can reference.
   - In the app service **Variables**, set `DATABASE_URL` to
     `${{Postgres.DATABASE_URL}}` (Railway's reference syntax).
3. **That's it for the DB** — the Prisma datasource provider and the runtime
   adapter both auto-switch to Postgres from the `DATABASE_URL` scheme (a build
   step runs `scripts/set-db-provider.mjs`). No schema edits needed.
4. **Set the remaining env vars** (see below) and deploy. The pre-deploy step runs
   `prisma db push` to create the tables.
5. **Seed (optional)**: run `npm run db:seed` once via a Railway shell to create the
   demo account, or just sign up.

### Option B — Railway + SQLite on a volume (fastest launch, zero DB setup)

Good for an MVP / single instance. No schema change needed.

1. Create the app service from the repo (root directory `magicmail/`).
2. *New → Volume*, mount it at `/data`.
3. Set `DATABASE_URL=file:/data/prod.db`.
4. Deploy. `prisma db push` (pre-deploy) creates the tables on the volume.

> SQLite on a volume runs on a **single** instance. Move to Option A before you
> scale horizontally.

## Alternative: Vercel (app) + Railway (Postgres)

If you'd rather use Vercel for the app (great Next.js DX, preview deploys, built-in
cron via `vercel.json`):

1. Create the Postgres database on Railway, copy its public `DATABASE_URL`.
2. Import the repo on Vercel, root directory `magicmail/`, set `DATABASE_URL` +
   the env vars below. The provider auto-switches to Postgres at build time.
3. The included `vercel.json` runs the daily scheduler cron automatically.

## The daily scheduler

The auto-send engine runs at `POST /api/cron/run` (protected by `CRON_SECRET`).

- **Vercel**: `vercel.json` already schedules it daily; set `CRON_SECRET` and Vercel
  sends it as a Bearer token automatically.
- **Railway**: add a second service (or a Railway **Cron** schedule) that runs
  `curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://<your-app>/api/cron/run`
  once a day.

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Postgres URL (prod) or `file:/data/prod.db` (SQLite volume) |
| `AUTH_SECRET` | ✅ | Long random string — signs session cookies |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your public URL, e.g. `https://kringle.up.railway.app` |
| `CRON_SECRET` | ▲ | Protects the scheduler endpoint |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | ▲ | Live billing + one-off gift checkout |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` / `_BUSINESS` | ▲ | Stripe Price IDs for the plans |
| `ANTHROPIC_API_KEY` | ▲ | Live AI note writing (else themed fallback) |
| `RESEND_API_KEY` / `EMAIL_FROM` | ▲ | Real email (verification, reset, notifications) |
| `HANDWRITING_PROVIDER` + `HANDWRYTTEN_*` | ▲ | Auto-pen provider (`handwrytten` / `axidraw` / `manual`) |
| `DELIVERY_WEBHOOK_SECRET` | ▲ | Auth for the delivery/tracking webhook |

▲ = optional; the app runs in demo mode for any integration whose keys are unset.

## After deploy: point Stripe webhooks

Set your Stripe webhook endpoint to `https://<your-app>/api/billing/webhook` and copy
the signing secret into `STRIPE_WEBHOOK_SECRET`. This fulfills subscriptions **and**
one-off gift purchases.
