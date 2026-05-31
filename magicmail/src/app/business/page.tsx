import Link from "next/link";
import { Logo } from "@/components/Logo";

// The B2B / client-retention pitch, split out from the consumer Kris Kringle
// Mail storefront. This is the seed of the future standalone "Relationship
// Care" sub-brand site; for now it lives at /business and feeds the dashboard.

export const metadata = {
  title: "Kringle for Business — automate client relationships",
  description:
    "Handwritten notes and thoughtful gifts, sent automatically at the moments that matter — so client and employee relationships never slip through the cracks.",
};

const AUDIENCES = [
  { title: "Real estate", body: "Closing-day welcome boxes and past-client touches that drive referrals.", emoji: "🏡" },
  { title: "Financial & advisory", body: "Client appreciation and milestones that lift retention and stand out — compliance-friendly.", emoji: "🤝" },
  { title: "Agencies & consultants", body: "Stay top of mind with a finite book of high-value relationships.", emoji: "💼" },
  { title: "Teams", body: "Work anniversaries and employee moments handled automatically.", emoji: "🎉" },
];

const PLANS = [
  {
    name: "Professional",
    price: "$49",
    cadence: "/mo + gifts",
    blurb: "For agents & solo operators growing on referrals.",
    features: ["Up to 250 contacts", "Unlimited automations", "CRM & calendar import", "ROI dashboard", "White-label gifts"],
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

function NavBar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo tone="light" />
        <div className="hidden items-center gap-8 text-sm text-cream/80 md:flex">
          <a href="#how" className="transition hover:text-cream">How it works</a>
          <a href="#audiences" className="transition hover:text-cream">Who it&apos;s for</a>
          <a href="#pricing" className="transition hover:text-cream">Pricing</a>
          <Link href="/" className="transition hover:text-cream">For families →</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-cream/80 transition hover:text-cream sm:block">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-gold-300 px-4 py-2 text-sm font-semibold text-pine-900 shadow-card transition hover:bg-gold-200"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-magic relative overflow-hidden pt-28 pb-24 text-cream">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3 py-1 text-xs font-medium text-gold-200">
          🤝 Kringle for Business
        </span>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
          The relationships you can&apos;t afford{" "}
          <span className="text-gold-300">to let go cold.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
          Kringle tells you which client relationships are slipping and sends a real,
          handwritten note or thoughtful gift on your behalf — then shows you their reaction.
          The thoughtful touch that drives referrals, automated.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-gold-300 px-6 py-3 font-semibold text-pine-900 shadow-lift transition hover:bg-gold-200"
          >
            Start free
          </Link>
          <Link
            href="#how"
            className="rounded-full border border-cream/25 px-6 py-3 font-semibold text-cream transition hover:bg-cream/10"
          >
            See how it works
          </Link>
        </div>
        <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-cream/15 pt-8">
          {[
            ["20×", "client lifetime value vs. acquisition cost"],
            ["⅔", "of advisors' business comes from referrals"],
            ["$312B", "corporate gifting market by 2025"],
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

const HOW_IT_WORKS = [
  { step: "01", title: "Add the people who matter", body: "Import contacts or sync your CRM, Google Calendar & Contacts. Birthdays, closings, and anniversaries all come along.", emoji: "📇" },
  { step: "02", title: "We watch for who's going cold", body: "Memory Keeper surfaces relationships slipping away and upcoming moments — before you'd ever remember them.", emoji: "🛰️" },
  { step: "03", title: "We write it by hand", body: "Robotic auto-pens write each note in real ink. No gift cards, no swag — a real keepsake, credited to you.", emoji: "✍️" },
  { step: "04", title: "You see it land", body: "Recipients scan a keepsake QR and send a reaction back. Track deliveries, retention & referrals from one dashboard.", emoji: "💌" },
];

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">How it works</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800">
          Never let a relationship slip through the cracks.
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

function Audiences() {
  return (
    <section id="audiences" className="bg-parchment py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Who it&apos;s for</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800">
            Built for people whose business is relationships.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Pricing</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800">
          Plans that scale with your book of relationships
        </h2>
      </div>
      <div className="mx-auto mt-14 grid max-w-3xl gap-6 lg:grid-cols-2">
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
              href="/signup"
              className={`mt-7 rounded-full px-5 py-2.5 text-center font-semibold transition ${
                plan.featured ? "bg-gold-300 text-pine-900 hover:bg-gold-200" : "bg-pine-700 text-cream hover:bg-pine-600"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
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
          Bring back the handwritten touch — automatically — for the relationships that grow your business.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex rounded-full bg-gold-300 px-7 py-3 font-semibold text-pine-900 shadow-lift transition hover:bg-gold-200"
        >
          Start free
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t hairline bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <Logo />
        <p className="text-sm text-pine-600/80">Kringle for Business — relationships, automated.</p>
        <Link href="/" className="text-xs font-medium text-pine-500 hover:text-pine-700">Kris Kringle Mail for families →</Link>
      </div>
    </footer>
  );
}

export default function BusinessPage() {
  return (
    <main>
      <NavBar />
      <Hero />
      <HowItWorks />
      <Audiences />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
