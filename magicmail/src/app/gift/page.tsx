import Link from "next/link";
import { Logo } from "@/components/Logo";
import { GiftCheckoutForm } from "@/components/marketing/GiftCheckoutForm";
import { CATALOG } from "@/lib/catalog";

export const metadata = {
  title: "Send a gift",
  description: "Send a single handwritten Santa letter or gift — no account needed.",
};

export default function GiftPage() {
  const products = CATALOG.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    emoji: p.emoji,
    blurb: p.blurb,
  }));

  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b hairline bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <Link href="/" className="text-sm font-medium text-pine-600 hover:text-pine-800">
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-pine-100 px-3 py-1 text-xs font-medium text-pine-700">
            🎁 One-off gift — no account needed
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-pine-800">
            Send a little magic
          </h1>
          <p className="mt-2 text-pine-600/90">
            Choose a gift, write a note (or let AI help), and we&apos;ll handwrite and mail it
            in real ink. Want to automate gifting all year?{" "}
            <Link href="/signup" className="font-semibold text-pine-700 underline-offset-4 hover:underline">
              Create an account
            </Link>.
          </p>
        </div>

        <GiftCheckoutForm products={products} />
      </div>
    </main>
  );
}
