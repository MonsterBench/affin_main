import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getMagicExperience } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "A magic message from Santa" };

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

  return (
    <main className="bg-magic min-h-screen text-cream">
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <Logo tone="light" />
        <p className="mt-10 text-5xl">🎅✨</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Hi {exp.childName}, Santa made you a video!
        </h1>

        <div className="mt-8 overflow-hidden rounded-3xl border border-gold-300/30 bg-pine-900/40 shadow-lift">
          {exp.videoStatus === "ready" && exp.videoUrl ? (
            <video controls playsInline poster="" className="aspect-video w-full bg-black">
              <source src={exp.videoUrl} />
              Your browser can&apos;t play this video.
            </video>
          ) : (
            <div className="grid aspect-video w-full place-items-center bg-pine-900/60 p-8">
              <div>
                <div className="animate-pulse text-5xl">🎬</div>
                <p className="mt-4 font-display text-lg text-cream">
                  Santa is recording your video at the North Pole!
                </p>
                <p className="mt-1 text-sm text-cream/70">Check back here soon — it&apos;s almost ready.</p>
              </div>
            </div>
          )}
        </div>

        {/* The letter, so the experience is complete even before the video lands */}
        <div className="mt-8 rounded-3xl border border-gold-300/30 bg-parchment p-7 text-left shadow-lift">
          <p className="mb-2 font-display text-sm font-semibold text-berry-500">Your letter from Santa</p>
          <p className="whitespace-pre-line font-display text-[15px] leading-relaxed text-pine-900">{exp.note}</p>
        </div>

        <p className="mt-10 text-sm text-cream/70">
          Want to send a little magic to someone you love?{" "}
          <Link href="/santa" className="font-semibold text-gold-300 underline-offset-4 hover:underline">
            Write a Santa letter
          </Link>
        </p>
      </div>
    </main>
  );
}
