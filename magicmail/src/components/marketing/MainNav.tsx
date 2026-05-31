"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";

// Light, warm marketing header matching the brand mockup: logo left, dropdown
// nav center, Get Started + Log In right, with a mobile disclosure menu.
const PRODUCTS = [
  { label: "Santa Letters", href: "/santa" },
  { label: "Gift Boxes", href: "/gift" },
  { label: "Magic Mail Club", href: "#club" },
];
const BUSINESS = [
  { label: "Overview", href: "/business" },
  { label: "Pricing", href: "/business#pricing" },
];

function Caret() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function Dropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 py-2 text-pine-800 transition hover:text-berry-500">
        {label} <Caret />
      </button>
      <div className="invisible absolute left-1/2 top-full z-10 w-52 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-pine-100 bg-white p-2 shadow-lift">
          {items.map((it) => (
            <Link key={it.label} href={it.href} className="block rounded-xl px-3 py-2 text-sm text-pine-700 transition hover:bg-pine-50 hover:text-berry-500">
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MainNav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => el.classList.toggle("shadow-card", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={ref} className="sticky top-0 z-50 border-b border-pine-100/70 bg-cream/90 backdrop-blur transition-shadow">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Logo variant="full" height={46} />

        <div className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <a href="#how" className="py-2 text-pine-800 transition hover:text-berry-500">How It Works</a>
          <Dropdown label="Products" items={PRODUCTS} />
          <Dropdown label="For Business" items={BUSINESS} />
          <a href="#gifts" className="py-2 text-pine-800 transition hover:text-berry-500">Pricing</a>
          <a href="#about" className="py-2 text-pine-800 transition hover:text-berry-500">About Us</a>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/santa" className="rounded-full bg-berry-500 px-5 py-2.5 text-sm font-semibold text-cream shadow-card transition hover:bg-berry-600">
            Get Started
          </Link>
          <Link href="/login" className="hidden items-center gap-1.5 rounded-full border border-pine-200 px-4 py-2.5 text-sm font-semibold text-pine-700 transition hover:border-pine-400 sm:inline-flex">
            <UserIcon /> Log In
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-pine-200 text-pine-700 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-pine-100 bg-cream px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium text-pine-800">
            <a href="#how" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-pine-50">How It Works</a>
            <Link href="/santa" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-pine-50">Santa Letters</Link>
            <Link href="/gift" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-pine-50">Gift Boxes</Link>
            <Link href="/business" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-pine-50">For Business</Link>
            <a href="#gifts" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-pine-50">Pricing</a>
            <a href="#about" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-pine-50">About Us</a>
            <Link href="/login" onClick={() => setOpen(false)} className="mt-1 rounded-lg px-2 py-2 hover:bg-pine-50">Log In</Link>
          </div>
        </div>
      )}
    </header>
  );
}
