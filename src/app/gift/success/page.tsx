import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getMagicExperience } from "@/lib/db";
import { appUrl } from "@/lib/urls";

export const metadata = { title: "Gift on its way" };
export const dynamic = "force-dynamic";

export default async function GiftSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const exp = token ? await getMagicExperience(token) : null;
  const magicUrl = token ? appUrl(`/magic/${token}`) : null;

  return (
    <main className="bg-magic flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center text-cream">
      <Logo tone="light" />
      <div className="mt-10 max-w-md">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Your gift is on its way!</h1>
        <p className="mt-4 text-cream/80">
          We&apos;re handwriting your note in real ink and getting it in the mail. A receipt is
          headed to your inbox. Thank you for sending a little magic.
        </p>

        {exp && magicUrl && (
          <div className="mt-8 rounded-3xl border border-gold-300/30 bg-cream/5 p-6">
            <p className="font-display text-lg font-semibold text-gold-300">✨ A magic keepsake</p>
            <p className="mt-1 text-sm text-cream/80">
              The letter includes a QR code. When {exp.childName} scans it, they get a keepsake page
              with their letter, a live Christmas countdown, and their Nice List badge.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/magic/${token}/qr`}
              alt="QR code to Santa's video"
              className="mx-auto mt-4 h-40 w-40 rounded-2xl bg-cream p-3"
            />
            <Link href={`/magic/${token}`} className="mt-3 inline-block text-sm font-semibold text-gold-300 underline-offset-4 hover:underline">
              Preview the magic page →
            </Link>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/santa" className="rounded-full bg-gold-300 px-6 py-3 font-semibold text-pine-900 transition hover:bg-gold-200">
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
