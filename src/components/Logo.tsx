"use client";

import Link from "next/link";
import { useState } from "react";
import { LOGO_SRC } from "@/lib/siteImages";

// Renders the Kris Kringle Mail logo. Prefers the real artwork at LOGO_SRC
// (public/logo.png); if that file isn't present yet, it falls back to a crafted
// badge + wordmark so the header never shows a broken image.
export function Logo({
  className = "",
  tone = "dark",
  href = "/",
  height = 40,
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string;
  height?: number;
}) {
  const [imgOk, setImgOk] = useState(true);
  const text = tone === "light" ? "text-cream" : "text-pine-800";

  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${className}`}>
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={LOGO_SRC}
          alt="Kris Kringle Mail"
          style={{ height }}
          className="w-auto"
          onError={() => setImgOk(false)}
        />
      ) : (
        <>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-pine-700 text-gold-300 shadow-card" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="m3.5 7 8.5 6 8.5-6" />
              <path d="M12 2.2l.7 1.6 1.7.2-1.3 1.2.4 1.7L12 6.1l-1.5.8.4-1.7L9.6 4l1.7-.2z" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className={`font-display text-lg font-semibold leading-none tracking-tight ${text}`}>
            Kris Kringle Mail
          </span>
        </>
      )}
    </Link>
  );
}
