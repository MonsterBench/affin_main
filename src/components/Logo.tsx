"use client";

import Link from "next/link";
import { useState } from "react";
import { LOGOS } from "@/lib/siteImages";

// Renders the Kris Kringle Mail logo, choosing the variant that reads best for
// the context:
//   - variant="mark" (default): wax-seal icon + cream/pine wordmark. Safe on the
//     dark nav, where the logo's green "MAIL" would otherwise disappear.
//   - variant="full": the full primary lockup. Best on light backgrounds (footer).
// If the artwork isn't in public/brand/ yet, it falls back to a crafted badge so
// the header never shows a broken image.
export function Logo({
  className = "",
  tone = "dark",
  href = "/",
  variant = "mark",
  height,
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string;
  variant?: "mark" | "full";
  height?: number;
}) {
  const [imgOk, setImgOk] = useState(true);
  const text = tone === "light" ? "text-cream" : "text-pine-800";

  if (variant === "full") {
    return (
      <Link href={href} className={`inline-flex items-center ${className}`}>
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={LOGOS.primary}
            alt="Kris Kringle Mail"
            style={{ height: height ?? 56 }}
            className="w-auto"
            onError={() => setImgOk(false)}
          />
        ) : (
          <Wordmark text={text} />
        )}
      </Link>
    );
  }

  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${className}`}>
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={LOGOS.icon}
          alt="Kris Kringle Mail"
          style={{ height: height ?? 38 }}
          className="w-auto"
          onError={() => setImgOk(false)}
        />
      ) : (
        <Seal />
      )}
      <span className={`font-display text-lg font-semibold leading-none tracking-tight ${text}`}>
        Kris Kringle Mail
      </span>
    </Link>
  );
}

// Crafted fallbacks (used only if the artwork files are absent).
function Seal() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-berry-500 text-cream shadow-card ring-2 ring-berry-600/40" aria-hidden>
      <span className="font-display text-xs font-bold tracking-tight">KK</span>
    </span>
  );
}

function Wordmark({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Seal />
      <span className={`font-display text-lg font-semibold leading-none tracking-tight ${text}`}>
        Kris Kringle Mail
      </span>
    </span>
  );
}
