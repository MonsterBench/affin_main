import Link from "next/link";
import { Logo } from "@/components/Logo";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { SiteNav } from "@/components/marketing/SiteNav";
import { Reveal } from "@/components/marketing/Reveal";
import {
  PenIcon, MailboxIcon, SparkleIcon, ShieldIcon, QrIcon,
  HeartIcon, CakeIcon, StarIcon, GiftIcon,
} from "@/components/marketing/Icon";
import { PHOTOS } from "@/lib/siteImages";
import { CATALOG } from "@/lib/catalog";
import { currency } from "@/lib/format";

// Consumer storefront for Kris Kringle Mail: Santa letters as the flagship,
// plus year-round "magic mail" for birthdays, anniversaries, and special
// occasions. The B2B / client-retention pitch lives separately at /business.

const HOW_IT_WORKS = [
  { step: "01", title: "Tell us about them", body: "Share a few details — their name, what they love, a proud moment from this year. The more you share, the more personal the letter.", Icon: HeartIcon },
  { step: "02", title: "We write it by hand", body: "A robotic auto-pen writes every letter in real ink, with a genuine signature — so it feels like it came straight from the North Pole.", Icon: PenIcon },
  { step: "03", title: "Magic in the mailbox", body: "It arrives as a real keepsake envelope with a North Pole postmark — and a secret QR code tucked inside.", Icon: MailboxIcon },
  { step: "04", title: "Watch the magic happen", body: "They scan the code to unlock a keepsake page — a countdown and their Nice List badge — and send a reaction back to you.", Icon: SparkleIcon },
];

const OCCASIONS = [
  { title: "Letters from Santa", body: "Our flagship — a personalized, hand-penned letter from the North Pole.", Icon: StarIcon },
  { title: "Birthdays", body: "A magical birthday surprise in the mailbox, written just for them.", Icon: CakeIcon },
  { title: "Anniversaries", body: "Mark the milestones that matter with a real handwritten note.", Icon: HeartIcon },
  { title: "Just because", body: "Sometimes the best surprises arrive for no reason at all.", Icon: MailboxIcon },
];

const TRUST = [
  { Icon: PenIcon, label: "Hand-penned in real ink" },
  { Icon: MailboxIcon, label: "North Pole postmark" },
  { Icon: QrIcon, label: "A scannable keepsake" },
  { Icon: ShieldIcon, label: "Magic guaranteed" },
];

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-gold-400 ${className}`} aria-label="Five out of five stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className="h-4 w-4" />
      ))}
    </span>
  );
}

function Hero() {
  return (
    <section className="bg-magic aurora relative overflow-hidden pb-20 pt-32 text-cream md:pt-36">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-gold-200">
            Real letters from Santa — and magic mail all year
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-balance md:text-6xl lg:text-7xl">
            A real letter from Santa,{" "}
            <span className="text-gold-300">written just for your child.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
            Personalized, hand-penned in real ink, and mailed with a North Pole postmark — plus a
            secret keepsake they&apos;ll never forget. When the holidays are over, send a little magic
            for birthdays, anniversaries, and just because.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/santa"
              className="rounded-full bg-gold-300 px-7 py-3.5 text-base font-semibold text-pine-900 shadow-lift transition hover:-translate-y-0.5 hover:bg-gold-200"
            >
              Write my child&apos;s letter
            </Link>
            <Link
              href="/gift"
              className="rounded-full border border-cream/25 px-7 py-3.5 text-base font-semibold text-cream transition hover:bg-cream/10"
            >
              Send a gift for any occasion
            </Link>
          </div>
          <div className="mt-9 flex items-center gap-3 text-sm text-cream/75">
            <Stars />
            <span>Loved by families nationwide</span>
          </div>
        </div>

        {/* Photographic hero with overlapping keepsake chips */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-cream/10 [transform:rotate(-2deg)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS.hero}
              alt="A child writing a letter to Santa by the Christmas tree"
              className="aspect-[5/6] w-full object-cover"
            />
          </div>
          <div className="animate-float glass-light absolute -left-4 top-10 rounded-2xl border border-white/60 px-4 py-2.5 shadow-lift">
            <Stars className="text-gold-500" />
            <div className="text-[11px] font-medium text-pine-600">“She kept it on her nightstand”</div>
          </div>
          <div
            className="animate-float glass-light absolute -right-3 bottom-12 flex items-center gap-2.5 rounded-2xl border border-white/60 px-4 py-3 shadow-lift"
            style={{ animationDelay: "1.4s" }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-berry-500 text-cream">
              <StarIcon className="h-4 w-4" />
            </span>
            <div className="text-left text-[11px] font-semibold leading-tight text-pine-800">
              On the<br />Nice List
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="relative mx-auto mt-16 max-w-6xl px-6">
        <div className="glass flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-cream/10 px-6 py-4 text-sm text-cream/85">
          {TRUST.map((t) => (
            <span key={t.label} className="inline-flex items-center gap-2">
              <t.Icon className="h-5 w-5 text-gold-300" />
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">How it works</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800 md:text-5xl">
          Four easy steps to a little magic.
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal
            key={s.step}
            delay={i * 90}
            className="group rounded-3xl border border-pine-100 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pine-50 text-pine-700 transition group-hover:bg-pine-700 group-hover:text-cream">
                <s.Icon className="h-6 w-6" />
              </span>
              <span className="font-display text-sm font-semibold text-pine-200">{s.step}</span>
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-pine-800">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-pine-600/90">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Occasions() {
  return (
    <section id="occasions" className="mx-auto max-w-6xl px-6 pb-12">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] text-cream shadow-lift">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTOS.occasions} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-pine-900/90 via-pine-900/80 to-pine-800/80" />
        <div className="relative px-8 py-14 md:px-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-300">Magic, all year round</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Not just for Christmas.
            </h2>
            <p className="mt-3 text-cream/80">
              Santa letters are how it starts. The same handwritten craft works for every moment
              worth remembering.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OCCASIONS.map((o) => (
              <div key={o.title} className="glass rounded-2xl border border-cream/10 p-6 transition duration-300 hover:-translate-y-1">
                <o.Icon className="h-7 w-7 text-gold-300" />
                <h3 className="mt-4 font-display text-lg font-semibold text-cream">{o.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream/75">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Gifts() {
  const featured = CATALOG.filter((p) => p.popular || p.tier === "deluxe").slice(0, 6);
  return (
    <section id="gifts" className="bg-parchment py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">The collection</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pine-800 md:text-5xl">
              Keepsakes for every season
            </h2>
            <p className="mt-3 text-pine-600/90">
              Santa letters are our flagship — and the same handwritten craft powers gift boxes and
              notes all year long.
            </p>
          </div>
          <Link href="/gift" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700 underline-offset-4 hover:underline">
            <GiftIcon className="h-4 w-4" /> Send a gift
          </Link>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal
              key={p.id}
              delay={(i % 3) * 90}
              className="group flex h-full flex-col rounded-3xl border border-pine-100 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pine-50 text-2xl">{p.emoji}</span>
                {p.popular && (
                  <span className="rounded-full bg-berry-500 px-2.5 py-0.5 text-xs font-semibold text-cream">Most loved</span>
                )}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-pine-800">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-pine-600/90">{p.blurb}</p>
              <div className="mt-5 flex items-center justify-between border-t border-pine-100 pt-4">
                <span className="font-display text-lg font-semibold text-pine-800">{currency(p.price)}</span>
                {p.handwritten && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gold-600">
                    <PenIcon className="h-3.5 w-3.5" /> Handwritten
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-magic aurora relative overflow-hidden py-24 text-center text-cream">
      <div className="relative mx-auto max-w-2xl px-6">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Ready to make some magic?
        </h2>
        <p className="mt-4 text-lg text-cream/80">
          Write your child&apos;s letter from Santa in minutes — or join our list for a little magic all year.
        </p>
        <div className="mt-9 flex justify-center">
          <Link
            href="/santa"
            className="rounded-full bg-gold-300 px-8 py-3.5 text-base font-semibold text-pine-900 shadow-lift transition hover:-translate-y-0.5 hover:bg-gold-200"
          >
            Write my child&apos;s letter
          </Link>
        </div>
        <div className="mt-10">
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
        <Logo variant="full" height={52} />
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
      <SiteNav />
      <Hero />
      <HowItWorks />
      <Occasions />
      <Gifts />
      <CTA />
      <Footer />
    </main>
  );
}
