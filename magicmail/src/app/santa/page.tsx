import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SantaLetterCreator } from "@/components/marketing/SantaLetterCreator";

export const metadata = {
  title: "Write a personalized letter from Santa",
  description:
    "Create a magical, personalized letter from Santa Claus — hand-penned in real ink and mailed from the North Pole. Tell Santa about your child and watch the magic.",
};

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

      <div className="mx-auto max-w-6xl px-6 py-12">
        <SantaLetterCreator />
      </div>
    </main>
  );
}
