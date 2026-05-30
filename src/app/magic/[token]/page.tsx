import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getMagicExperience } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "A magic keepsake from Santa" };

function sleepsUntilChristmas(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let xmas = new Date(now.getFullYear(), 11, 25);
  if (today > xmas) xmas = new Date(now.getFullYear() + 1, 11, 25);
  return Math.round((xmas.getTime() - today.getTime()) / 86_400_000);
}

export default async function MagicPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const exp = await getMagicExperience(token);

  if (!exp) {
    return (
      <main className="bg-magic flex min-h-screen flex-col items-center justify-center px-6 text-center text-cream">
        <Logo tone="light" />
        <p className="mt-8 text-cream/80">This magic link isn&apos;t valid. Please check the code on your letter.</p>
      </main>
    );
  }

  const sleeps = sleepsUntilChristmas();

  return (
    <main className="bg-magic min-h-screen text-cream">
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <Logo tone="light" />
        <p className="mt-10 text-5xl">🎅✨</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          A magic keepsake for {exp.childName}
        </h1>

        {/* Nice List flourish */}
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-cream/5 px-4 py-1.5 text-sm text-gold-200">
          ⭐ {exp.childName} is on the Nice List
        </div>

        {/* Christmas countdown */}
        <div className="mt-6 rounded-3xl border border-gold-300/30 bg-pine-900/40 p-6 shadow-lift">
          <p className="font-display text-5xl font-semibold text-gold-300">{sleeps}</p>
          <p className="mt-1 text-cream/80">{sleeps === 1 ? "sleep" : "sleeps"} until Christmas! 🎄</p>
        </div>

        {/* The letter — the heart of the keepsake, always here, re-readable forever */}
        <div className="mt-8 rounded-3xl border border-gold-300/30 bg-parchment p-7 text-left shadow-lift">
          <p className="mb-2 font-display text-sm font-semibold text-berry-500">Your letter from Santa</p>
          <p className="whitespace-pre-line font-display text-[15px] leading-relaxed text-pine-900">{exp.note}</p>
        </div>

        {/* Video — strictly a beta add-on; only shown when one actually exists */}
        {exp.videoStatus === "ready" && exp.videoUrl && (
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="font-display text-lg font-semibold text-cream">A video message from Santa</span>
              <span className="rounded-full bg-gold-300/20 px-2 py-0.5 text-xs font-semibold text-gold-200">Beta</span>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gold-300/30 shadow-lift">
              <video controls playsInline className="aspect-video w-full bg-black">
                <source src={exp.videoUrl} />
                Your browser can&apos;t play this video.
              </video>
            </div>
          </div>
        )}

        <p className="mt-10 text-sm text-cream/70">
          Want to send a little magic to someone you love?{" "}
          <Link href="/santa" className="font-semibold text-gold-300 underline-offset-4 hover:underline">
            Write your own letter from Santa
          </Link>
        </p>
      </div>
    </main>
  );
}
