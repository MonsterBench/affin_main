import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SantaLetterCreator } from "@/components/marketing/SantaLetterCreator";
import { ChristmasCountdown } from "@/components/marketing/ChristmasCountdown";

export const metadata = {
  title: "Write a personalized letter from Santa",
  description:
    "Create a magical, personalized letter from Santa Claus — hand-penned in real ink and mailed from the North Pole. Tell Santa about your child and watch the magic.",
};

const TRUST = [
  { emoji: "✍️", title: "Real ink, real handwriting", body: "Every letter is penned by a robotic auto-pen in genuine ink — not a printed font. It feels like Santa wrote it himself." },
  { emoji: "📮", title: "North Pole postmark", body: "Mailed in a keepsake envelope stamped from the North Pole, so the magic starts the moment it lands in the mailbox." },
  { emoji: "✨", title: "A secret keepsake", body: "A hidden QR code unlocks a magic page with a Christmas countdown and their very own Nice List badge." },
];

const TESTIMONIALS = [
  { quote: "My daughter gasped when she saw her name in Santa's handwriting. She's kept the letter on her nightstand for weeks.", name: "Maria L.", detail: "mom of two" },
  { quote: "The QR code was the best part — my son scanned it and just lit up. Worth every penny.", name: "James R.", detail: "dad in Denver" },
  { quote: "It arrived faster than I expected and the paper feels so special. We're making it a tradition.", name: "Priya S.", detail: "first-time customer" },
];

const FAQ = [
  { q: "Is the letter really handwritten?", a: "Yes — each letter is written in real ink by a robotic auto-pen, so the strokes look and feel genuinely handwritten, not printed." },
  { q: "How long does delivery take?", a: "Letters are penned and mailed within 2–3 business days. For guaranteed Christmas delivery, order by December 18." },
  { q: "What is the magic keepsake page?", a: "Each letter includes a QR code. When your child scans it, they unlock a personalized page with a live Christmas countdown and their Nice List badge." },
  { q: "Can I send letters at other times of year?", a: "Absolutely. Santa's mailbox is open all year — birthdays, milestones, or just because. The same handwritten magic, any occasion." },
  { q: "What if I'm not happy?", a: "Magic guaranteed. If the letter isn't everything you hoped, we'll make it right or refund you — no questions asked." },
];

function Trust() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-4">
      <div className="grid gap-5 sm:grid-cols-3">
        {TRUST.map((t) => (
          <div key={t.title} className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
            <span className="text-3xl">{t.emoji}</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-pine-800">{t.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-pine-600/90">{t.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-parchment py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Loved by families</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-pine-800">
            The look on their face is the whole point.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
              <div className="text-gold-400">{"★★★★★"}</div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-pine-700">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-pine-800">
                {t.name} <span className="font-normal text-pine-500">· {t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Questions</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-pine-800">
          Everything you&apos;re wondering
        </h2>
      </div>
      <div className="mt-10 divide-y divide-pine-100 rounded-2xl border border-pine-100 bg-white shadow-card">
        {FAQ.map((f) => (
          <details key={f.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer items-center justify-between font-display text-base font-semibold text-pine-800 marker:content-['']">
              {f.q}
              <span className="text-pine-400 transition group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-pine-600/90">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="bg-magic py-16 text-center text-cream">
      <div className="mx-auto max-w-xl px-6">
        <div className="text-4xl">💯</div>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">Magic, guaranteed</h2>
        <p className="mt-3 text-cream/80">
          If your child&apos;s letter isn&apos;t everything you hoped, we&apos;ll rewrite it or refund you — no questions asked.
        </p>
        <Link
          href="#create"
          className="mt-7 inline-flex rounded-full bg-gold-300 px-7 py-3 font-semibold text-pine-900 shadow-lift transition hover:bg-gold-200"
        >
          🎅 Write your letter
        </Link>
      </div>
    </section>
  );
}

export default function SantaPage() {
  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b hairline bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <Link href="/" className="text-sm font-medium text-pine-600 hover:text-pine-800">← Back to home</Link>
        </div>
      </header>

      <section className="bg-magic text-cream">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3 py-1 text-xs font-medium text-gold-200">
            🎅 The original — a real letter from Santa
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-balance md:text-5xl">
            A letter from Santa, written just for your child
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Tell Santa a little about them, and we&apos;ll craft a personalized letter that mentions
            their name, what they love, and something kind they did this year — hand-penned in real
            ink and mailed with a North Pole postmark.
          </p>
        </div>
      </section>

      <div id="create" className="mx-auto -mt-6 max-w-6xl px-6">
        <div className="flex justify-center">
          <ChristmasCountdown />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <SantaLetterCreator />
      </div>

      <Trust />
      <Testimonials />
      <Faq />
      <Guarantee />
    </main>
  );
}
