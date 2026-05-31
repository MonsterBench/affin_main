"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";

// Sticky top nav that turns to frosted glass once you scroll past the hero.
// Toggles a class via ref (no state) so it never forces a re-render.
export function SiteNav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.classList.toggle("nav-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300 [&.nav-scrolled]:glass [&.nav-scrolled]:shadow-card [&.nav-scrolled]:ring-1 [&.nav-scrolled]:ring-cream/10"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo tone="light" />
        <div className="hidden items-center gap-7 text-sm text-cream/80 lg:flex">
          <a href="#how" className="transition hover:text-cream">How it works</a>
          <a href="#occasions" className="transition hover:text-cream">Occasions</a>
          <a href="#gifts" className="transition hover:text-cream">Gifts</a>
          <Link href="/santa" className="transition hover:text-cream">Santa letters</Link>
          <Link href="/business" className="transition hover:text-cream">For business</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-cream/80 transition hover:text-cream sm:block">
            Sign in
          </Link>
          <Link
            href="/santa"
            className="rounded-full bg-gold-300 px-4 py-2 text-sm font-semibold text-pine-900 shadow-card transition hover:bg-gold-200 hover:shadow-lift"
          >
            Write my letter
          </Link>
        </div>
      </nav>
    </header>
  );
}
