import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Gift on its way" };

export default function GiftSuccessPage() {
  return (
    <main className="bg-magic flex min-h-screen flex-col items-center justify-center px-6 text-center text-cream">
      <Logo tone="light" />
      <div className="mt-10 max-w-md">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Your gift is on its way!</h1>
        <p className="mt-4 text-cream/80">
          We&apos;re handwriting your note in real ink and getting it in the mail. A receipt is
          headed to your inbox. Thank you for sending a little magic.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/gift" className="rounded-full bg-gold-300 px-6 py-3 font-semibold text-pine-900 transition hover:bg-gold-200">
            Send another
          </Link>
          <Link href="/signup" className="rounded-full border border-cream/25 px-6 py-3 font-semibold text-cream transition hover:bg-cream/10">
            Automate gifting all year
          </Link>
        </div>
      </div>
    </main>
  );
}
