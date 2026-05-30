import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CATALOG } from "@/lib/catalog";
import { currency } from "@/lib/format";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Add the people who matter",
    body: "Upload contacts or sync your CRM. Birthdays, closings, work anniversaries, and the holidays all come along.",
    emoji: "📇",
  },
  {
    step: "02",
    title: "Set it once, send all year",
    body: "Pick a gift and a moment. Kringle watches the calendar and triggers the send with the right lead time.",
    emoji: "🗓️",
  },
  {
    step: "03",
    title: "We write it by hand",
    body: "Our robotic auto-pens write each note in real ink — Santa letters and thank-yous that feel truly personal.",
    emoji: "✍️",
  },
  {
    step: "04",
    title: "You get all the credit",
    body: "No Kringle branding on the gift. Track handwriting, assembly, and delivery from one dashboard.",
    emoji: "📦",
  },
];

const AUDIENCES = [
  { title: "Families", body: "Authentic letters from Santa and milestone boxes that make childhood magic.", emoji: "🎄" },
  { title: "Real estate", body: "Closing-day welcome boxes and past-client touches that drive referrals.", emoji: "🏡" },
  { title: "Financial & B2B", body: "Client appreciation and milestones that lift retention and stand out.", emoji: "🤝" },
  { title: "Teams", body: "Work anniversaries and employee moments handled automatically.", emoji: "🎉" },
];

function NavBar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo tone="light" />
        <div className="hidden items-center gap-8 text-sm text-cream/80 md:flex">
          <a href="#how" className="transition hover:text-cream">How it works</a>
          <a href="#gifts" className="transition hover:text-cream">Gifts</a>
          <a href="#business" className="transition hover:text-cream">For business</a>
          <a href="#pricing" className="transition hover:text-cream">Pricing</a>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full bg-gold-300 px-4 py-2 text-sm font-semibold text-pine-900 shadow-card transition hover:bg-gold-200"
        >
          Open dashboard
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-magic relative overflow-hidden pt-28 pb-24 text-cream">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3 py-1 text-xs font-medium text-gold-200">
          🎅 The platform behind Kris Kringle Mail
        </span>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
          Automate thoughtfulness.{" "}
          <span className="text-gold-300">Send a little magic.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
          Handwritten Santa letters, year-round gift boxes, and corporate
          appreciation — sent automatically at the moments that matter. Real ink,
          real keepsakes, zero busywork.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-gold-300 px-6 py-3 font-semibold text-pine-900 shadow-lift transition hover:bg-gold-200"
          >
            Start sending magic
          </Link>
          <a
            href="#how"
            className="rounded-full border border-cream/25 px-6 py-3 font-semibold text-cream transition hover:bg-cream/10"
          >
            See how it works
          </a>
        </div>
        <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-cream/15 pt-8">
          {[
            ["99%", "open rate on handwritten mail"],
            ["4.4%", "direct-mail response vs. 0.12% email"],
            ["$14B+", "personalized gifting market by 2030"],
          ].map(([stat, label]) => (
            <div key={label}>
              <dt className="font-display text-3xl font-semibold text-gold-300">{stat}</dt>
              <dd className="mt-1 text-sm text-cream/70">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">How it works</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800">
          Set the moment. We handle the magic.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((s) => (
          <div key={s.step} className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card transition hover:shadow-lift">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{s.emoji}</span>
              <span className="font-display text-sm font-semibold text-pine-200">{s.step}</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-pine-800">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-pine-600/90">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Gifts() {
  const featured = CATALOG.filter((p) => p.popular || p.tier === "deluxe").slice(0, 6);
  return (
    <section id="gifts" className="bg-parchment py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">The collection</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800">
              Keepsakes for every season
            </h2>
            <p className="mt-3 text-pine-600/90">
              Santa letters are our flagship — and the same handwritten craft powers
              gift boxes and notes all year long.
            </p>
          </div>
          <Link href="/dashboard/catalog" className="text-sm font-semibold text-pine-700 underline-offset-4 hover:underline">
            Browse the full catalog →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-pine-100 bg-white p-6 shadow-card transition hover:shadow-lift">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-pine-50 text-2xl">{p.emoji}</span>
                {p.popular && (
                  <span className="rounded-full bg-berry-500 px-2.5 py-0.5 text-xs font-semibold text-cream">
                    Most loved
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-pine-800">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-pine-600/90">{p.blurb}</p>
              <div className="mt-4 flex items-center justify-between border-t border-pine-100 pt-4">
                <span className="font-display text-lg font-semibold text-pine-800">{currency(p.price)}</span>
                {p.handwritten && <span className="text-xs font-medium text-gold-600">✍️ Handwritten</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Business() {
  return (
    <section id="business" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">For business</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800">
            The thoughtful touch that drives referrals
          </h2>
          <p className="mt-4 leading-relaxed text-pine-600/90">
            In a world drowning in email, a real handwritten note gets opened, kept,
            and remembered. Kringle automates client appreciation, closing gifts, and
            employee milestones — so relationships never slip through the cracks.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "CRM triggers for closings, anniversaries & milestones",
              "Curated, never-repeating gift selections",
              "ROI dashboard: deliveries, retention & referrals",
              "White-label — every gift is credited to you",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-pine-700">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pine-600 text-xs text-cream">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex rounded-full bg-pine-700 px-6 py-3 font-semibold text-cream shadow-card transition hover:bg-pine-600"
          >
            Explore the platform
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card transition hover:shadow-lift">
              <span className="text-3xl">{a.emoji}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-pine-800">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-pine-600/90">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "Magic Mail Club",
    price: "$0",
    cadence: "+ gifts at cost",
    blurb: "For families. Pay only for what you send.",
    features: ["Santa letters & seasonal boxes", "Birthday & milestone reminders", "Handwritten notes", "Delivery tracking"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Professional",
    price: "$49",
    cadence: "/mo + gifts",
    blurb: "For agents & small teams growing on referrals.",
    features: ["Up to 250 contacts", "Unlimited automations", "CRM import", "ROI dashboard", "White-label gifts"],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Business",
    price: "$199",
    cadence: "/mo + gifts",
    blurb: "For firms automating gifting at scale.",
    features: ["Unlimited contacts", "Team seats & roles", "API & Zapier", "Dedicated concierge", "Custom keepsakes"],
    cta: "Talk to sales",
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="bg-parchment py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Pricing</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800">
            Subscriptions that scale with your thoughtfulness
          </h2>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-7 shadow-card ${
                plan.featured ? "border-pine-600 bg-pine-700 text-cream" : "border-pine-100 bg-white"
              }`}
            >
              {plan.featured && (
                <span className="mb-4 w-fit rounded-full bg-gold-300 px-3 py-0.5 text-xs font-semibold text-pine-900">
                  Most popular
                </span>
              )}
              <h3 className={`font-display text-xl font-semibold ${plan.featured ? "text-cream" : "text-pine-800"}`}>
                {plan.name}
              </h3>
              <p className={`mt-1 text-sm ${plan.featured ? "text-cream/75" : "text-pine-600/90"}`}>{plan.blurb}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{plan.price}</span>
                <span className={`text-sm ${plan.featured ? "text-cream/70" : "text-pine-500"}`}>{plan.cadence}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className={plan.featured ? "text-gold-300" : "text-pine-600"}>✓</span>
                    <span className={plan.featured ? "text-cream/90" : "text-pine-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={`mt-7 rounded-full px-5 py-2.5 text-center font-semibold transition ${
                  plan.featured
                    ? "bg-gold-300 text-pine-900 hover:bg-gold-200"
                    : "bg-pine-700 text-cream hover:bg-pine-600"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-magic py-20 text-center text-cream">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-balance">
          Make this the year you never miss a moment.
        </h2>
        <p className="mt-4 text-cream/80">
          Join the waitlist of agents, advisors, and families bringing back the
          handwritten touch.
        </p>
        <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-cream/20 bg-cream/10 px-5 py-3 text-cream placeholder:text-cream/50 focus:border-gold-300 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-gold-300 px-6 py-3 font-semibold text-pine-900 transition hover:bg-gold-200"
          >
            Join waitlist
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t hairline bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <Logo />
        <p className="text-sm text-pine-600/80">kriskringlemail.com — Automate thoughtfulness.</p>
        <p className="text-xs text-pine-500">© {new Date().getFullYear()} Kringle. Made with a little magic.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <HowItWorks />
      <Gifts />
      <Business />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
