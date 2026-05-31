import Link from "next/link";
import { Logo } from "@/components/Logo";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { CATALOG } from "@/lib/catalog";
import { currency } from "@/lib/format";

// Consumer storefront for Kris Kringle Mail: Santa letters as the flagship,
// plus year-round "magic mail" for birthdays, anniversaries, and special
// occasions. The B2B / client-retention pitch lives separately at /business.

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us about them",
    body: "Share a few details — their name, what they love, a proud moment. The more you share, the more magical the letter.",
    emoji: "✏️",
  },
  {
    step: "02",
    title: "We write it by hand",
    body: "Our robotic auto-pens write every letter in real ink, so it feels like it came straight from the North Pole.",
    emoji: "✍️",
  },
  {
    step: "03",
    title: "Magic in the mailbox",
    body: "It arrives as a real keepsake with a North Pole postmark — and a secret QR code tucked inside.",
    emoji: "📮",
  },
  {
    step: "04",
    title: "Watch the magic happen",
    body: "They scan the code to unlock a keepsake page — a countdown, their Nice List badge — and send a reaction back to you.",
    emoji: "✨",
  },
];

const OCCASIONS = [
  { title: "Letters from Santa", body: "Our flagship — a personalized, hand-penned letter from the North Pole.", emoji: "🎅" },
  { title: "Birthdays", body: "A magical birthday surprise in the mailbox, written just for them.", emoji: "🎂" },
  { title: "Anniversaries", body: "Mark the milestones that matter with a real handwritten note.", emoji: "💞" },
  { title: "Thank-yous & just because", body: "Sometimes the best surprises arrive for no reason at all.", emoji: "💌" },
];

function NavBar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo tone="light" />
        <div className="hidden items-center gap-8 text-sm text-cream/80 md:flex">
          <a href="#how" className="transition hover:text-cream">How it works</a>
          <a href="#occasions" className="transition hover:text-cream">Occasions</a>
          <a href="#gifts" className="transition hover:text-cream">Gifts</a>
          <Link href="/santa" className="transition hover:text-cream">Santa letters</Link>
          <Link href="/business" className="transition hover:text-cream">For business →</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-cream/80 transition hover:text-cream sm:block">
            Sign in
          </Link>
          <Link
            href="/santa"
            className="rounded-full bg-gold-300 px-4 py-2 text-sm font-semibold text-pine-900 shadow-card transition hover:bg-gold-200"
          >
            Write a Santa letter
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
          🎅 Real letters from Santa — and magic mail all year
        </span>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
          A real letter from Santa,{" "}
          <span className="text-gold-300">written just for your child.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
          Personalized, hand-penned in real ink, and mailed with a North Pole postmark —
          plus a secret keepsake they&apos;ll never forget. And when the holidays are over,
          send a little magic for birthdays, anniversaries, and just because.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/santa"
            className="rounded-full bg-gold-300 px-6 py-3 font-semibold text-pine-900 shadow-lift transition hover:bg-gold-200"
          >
            🎅 Write a Santa letter
          </Link>
          <Link
            href="/gift"
            className="rounded-full border border-cream/25 px-6 py-3 font-semibold text-cream transition hover:bg-cream/10"
          >
            Send a gift for any occasion
          </Link>
        </div>
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/15 pt-8 text-sm text-cream/75">
          <span className="inline-flex items-center gap-2">✍️ Hand-penned in real ink</span>
          <span className="inline-flex items-center gap-2">📮 North Pole postmark</span>
          <span className="inline-flex items-center gap-2">✨ A scannable keepsake</span>
          <span className="inline-flex items-center gap-2">💯 Magic guaranteed</span>
        </div>
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
          Four easy steps to a little magic.
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

function Occasions() {
  return (
    <section id="occasions" className="mx-auto max-w-6xl px-6 pb-8">
      <div className="rounded-3xl bg-pine-700 px-8 py-12 text-cream">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-300">Magic, all year round</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Not just for Christmas.
          </h2>
          <p className="mt-3 text-cream/80">
            Santa letters are how it starts. The same handwritten magic works for every moment worth remembering.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((o) => (
            <div key={o.title} className="rounded-2xl bg-cream/5 p-6 ring-1 ring-cream/10">
              <span className="text-3xl">{o.emoji}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-cream">{o.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/75">{o.body}</p>
            </div>
          ))}
        </div>
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
          <Link href="/gift" className="text-sm font-semibold text-pine-700 underline-offset-4 hover:underline">
            Send a gift →
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

function CTA() {
  return (
    <section className="bg-magic py-20 text-center text-cream">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-balance">
          Ready to make some magic?
        </h2>
        <p className="mt-4 text-cream/80">
          Write your child&apos;s letter from Santa in minutes — or join our list for a little magic all year.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/santa"
            className="rounded-full bg-gold-300 px-7 py-3 font-semibold text-pine-900 shadow-lift transition hover:bg-gold-200"
          >
            🎅 Write a Santa letter
          </Link>
        </div>
        <div className="mt-8">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t hairline bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <Logo />
        <p className="text-sm text-pine-600/80">kriskringlemail.com — a little magic in every mailbox.</p>
        <div className="flex items-center gap-4">
          <Link href="/business" className="text-xs font-medium text-pine-500 hover:text-pine-700">For business →</Link>
          <p className="text-xs text-pine-500">© {new Date().getFullYear()} Kris Kringle Mail.</p>
        </div>
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
      <Occasions />
      <Gifts />
      <CTA />
      <Footer />
    </main>
  );
}
