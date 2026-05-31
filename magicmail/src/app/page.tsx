import Link from "next/link";
import { Logo } from "@/components/Logo";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { MainNav } from "@/components/marketing/MainNav";
import { Reveal } from "@/components/marketing/Reveal";
import {
  PenIcon, CpuIcon, GiftIcon, MailboxIcon, ShieldIcon,
  HeartIcon, BoxIcon, TruckIcon, StarIcon,
} from "@/components/marketing/Icon";
import { PHOTOS } from "@/lib/siteImages";
import { CATALOG } from "@/lib/catalog";
import { currency } from "@/lib/format";

// Consumer storefront for Kris Kringle Mail — handwritten Santa letters as the
// flagship, plus year-round magic mail. Light, warm brand theme. The B2B pitch
// lives at /business.

const FEATURES = [
  { Icon: PenIcon, label: "Handwritten by", strong: "Robotic Auto-Pen" },
  { Icon: CpuIcon, label: "AI-Powered", strong: "Personalization" },
  { Icon: GiftIcon, label: "Premium Gifts", strong: "& Add-Ons" },
  { Icon: MailboxIcon, label: "North Pole", strong: "Postmarked" },
  { Icon: ShieldIcon, label: "Secure", strong: "& Private" },
];

const AUDIENCES = [
  { title: "For Families", color: "text-berry-500", photo: PHOTOS.families, alt: "A family delighted by a letter from Santa", href: "/santa",
    body: "Create magical memories with personalized letters, keepsakes and gifts your kids will never forget." },
  { title: "For Businesses", color: "text-pine-700", photo: PHOTOS.business, alt: "Writing a handwritten note at a cozy desk", href: "/business",
    body: "Build stronger relationships with automated handwritten notes and gifts that leave a lasting impression." },
  { title: "Magic Mail Club", color: "text-berry-500", photo: PHOTOS.giftbox, alt: "A North Pole gift box with a letter and treats", href: "#club",
    body: "Quarterly letters and curated gift boxes delivered year-round. The magic never stops!" },
];

const STEPS = [
  { n: 1, Icon: HeartIcon, title: "You Tell Us", body: "Share details, upload photos, and choose your package.", tone: "berry" },
  { n: 2, Icon: CpuIcon, title: "We Create", body: "Our AI drafts a personalized letter just for them.", tone: "pine" },
  { n: 3, Icon: PenIcon, title: "We Handwrite", body: "A robotic auto-pen writes it in authentic ink.", tone: "berry" },
  { n: 4, Icon: BoxIcon, title: "We Package", body: "We add special touches and a North Pole postmark.", tone: "pine" },
  { n: 5, Icon: TruckIcon, title: "We Deliver", body: "We mail it to their door for a magical moment.", tone: "berry" },
] as const;

function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="inline-flex gap-0.5 text-gold-400" aria-label="4.9 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} className={className} />)}
    </span>
  );
}

function Hero() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            <span className="block text-pine-900">Handwritten Letters.</span>
            <span className="block text-berry-500">Real Magic. Delivered.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-pine-700/90">
            Personalized letters and gifts from Kris Kringle — beautifully handwritten and sent with
            love from the North Pole.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/santa" className="rounded-full bg-berry-500 px-7 py-3.5 text-base font-semibold text-cream shadow-card transition hover:-translate-y-0.5 hover:bg-berry-600">
              Order a Santa Letter
            </Link>
            <Link href="/gift" className="rounded-full border-2 border-pine-700 px-7 py-3.5 text-base font-semibold text-pine-700 transition hover:bg-pine-700 hover:text-cream">
              Explore Gift Boxes
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2.5 text-sm text-pine-700">
            <Stars />
            <span><strong className="font-semibold">4.9/5</strong> from 2,000+ happy families</span>
          </div>
        </div>

        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTOS.hero}
            alt="Santa hand-penning a personalized letter by lantern light"
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift ring-1 ring-pine-900/10"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureBar() {
  return (
    <section className="bg-pine-700 text-cream">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-5 px-6 py-5">
        {FEATURES.map((f) => (
          <div key={f.strong} className="flex items-center gap-3 lg:border-l lg:border-cream/15 lg:pl-6 lg:first:border-0 lg:first:pl-0">
            <f.Icon className="h-6 w-6 shrink-0 text-gold-300" />
            <span className="text-sm leading-tight">
              {f.label}<br /><strong className="font-semibold">{f.strong}</strong>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Audiences() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a.title} delay={i * 90} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-pine-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.photo} alt={a.alt} className="aspect-[16/10] w-full object-cover" />
            <div className="flex flex-1 flex-col p-6">
              <h3 className={`font-display text-2xl font-semibold ${a.color}`}>{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-pine-600/90">{a.body}</p>
              <Link href={a.href} className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${a.color}`}>
                Learn More <span className="transition group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="bg-parchment py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-pine-900">How It Works</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80} className="relative flex flex-col items-center text-center">
              <span className={`grid h-16 w-16 place-items-center rounded-full text-cream shadow-card ${s.tone === "berry" ? "bg-berry-500" : "bg-pine-700"}`}>
                <s.Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-pine-900">{s.n}. {s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-pine-600/90">{s.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-14 overflow-hidden rounded-3xl shadow-lift ring-1 ring-pine-900/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.keepsake} alt="An addressed keepsake envelope beside an official Nice List certificate" className="aspect-[21/9] w-full object-cover" />
        </Reveal>
      </div>
    </section>
  );
}

function Gifts() {
  const featured = CATALOG.filter((p) => p.popular || p.tier === "deluxe").slice(0, 6);
  return (
    <section id="gifts" className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-berry-500">The collection</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-pine-900">Letters, keepsakes & gift boxes</h2>
            <p className="mt-3 text-pine-600/90">Santa letters are our flagship — and the same handwritten craft powers gift boxes and notes all year long.</p>
          </div>
          <Link href="/gift" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700 underline-offset-4 hover:underline">
            <GiftIcon className="h-4 w-4" /> Send a gift
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90} className="group flex h-full flex-col rounded-3xl border border-pine-100 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pine-50 text-2xl">{p.emoji}</span>
                {p.popular && <span className="rounded-full bg-berry-500 px-2.5 py-0.5 text-xs font-semibold text-cream">Most loved</span>}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-pine-800">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-pine-600/90">{p.blurb}</p>
              <div className="mt-5 flex items-center justify-between border-t border-pine-100 pt-4">
                <span className="font-display text-lg font-semibold text-pine-800">{currency(p.price)}</span>
                {p.handwritten && <span className="inline-flex items-center gap-1 text-xs font-medium text-gold-600"><PenIcon className="h-3.5 w-3.5" /> Handwritten</span>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-parchment py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-berry-500">Our story</p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-pine-900">Real magic, made by hand.</h2>
        <p className="mt-5 text-lg leading-relaxed text-pine-700/90">
          We started Kris Kringle Mail to bring back the wonder of a real letter in the mailbox — written
          in genuine ink, sealed with wax, and postmarked from the North Pole. It begins with Santa, but
          the magic doesn&apos;t stop in December: birthdays, milestones, and just-because moments deserve
          a little wonder all year round.
        </p>
        <div className="mt-7 flex justify-center">
          <Link href="/santa" className="rounded-full bg-berry-500 px-7 py-3.5 font-semibold text-cream shadow-card transition hover:-translate-y-0.5 hover:bg-berry-600">
            Order a Santa Letter
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="club" className="bg-magic relative overflow-hidden py-20 text-center text-cream">
      <div className="relative mx-auto max-w-2xl px-6">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">Join the Magic Mail Club</h2>
        <p className="mt-4 text-lg text-cream/80">
          Quarterly handwritten letters and curated gift boxes, delivered year-round. Join our list and
          we&apos;ll let you know the moment it opens.
        </p>
        <div className="mt-9"><WaitlistForm /></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t hairline bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <Logo variant="full" height={52} />
        <p className="text-sm text-pine-600/80">kriskringlemail.com — Real Magic, Delivered.</p>
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
      <MainNav />
      <Hero />
      <FeatureBar />
      <Audiences />
      <HowItWorks />
      <Gifts />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}
