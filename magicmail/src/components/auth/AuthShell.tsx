import Link from "next/link";
import { Logo } from "@/components/Logo";

export function AuthShell({
  title,
  subtitle,
  demoHint,
  children,
}: {
  title: string;
  subtitle: string;
  demoHint?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="bg-magic relative hidden w-1/2 flex-col justify-between p-12 text-cream lg:flex">
        <Logo tone="light" />
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-balance">
            Automate thoughtfulness.<br />
            <span className="text-gold-300">Send a little magic.</span>
          </h1>
          <p className="mt-4 max-w-sm text-cream/75">
            Handwritten Santa letters, year-round gift boxes, and corporate
            appreciation — sent automatically at the moments that matter.
          </p>
        </div>
        <p className="text-sm text-cream/60">kriskringlemail.com</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h2 className="mt-8 font-display text-3xl font-semibold tracking-tight text-pine-800 lg:mt-0">
            {title}
          </h2>
          <p className="mt-2 text-sm text-pine-600">{subtitle}</p>

          {demoHint && (
            <div className="mt-5 rounded-xl border border-gold-200 bg-gold-100/50 px-4 py-3 text-sm text-pine-700">
              <span className="font-medium">Try the demo:</span> demo@kriskringlemail.com / magicmail
            </div>
          )}

          <div className="mt-6">{children}</div>

          <p className="mt-8 text-center text-xs text-pine-400">
            <Link href="/" className="hover:text-pine-600">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
