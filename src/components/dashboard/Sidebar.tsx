"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "◈", exact: true },
  { href: "/dashboard/recipients", label: "Recipients", icon: "👥" },
  { href: "/dashboard/automations", label: "Automations", icon: "⚡" },
  { href: "/dashboard/sends", label: "Send pipeline", icon: "📦" },
  { href: "/dashboard/catalog", label: "Gift catalog", icon: "🎁" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r hairline bg-white px-4 py-6 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-pine-700 text-cream shadow-card"
                  : "text-pine-700 hover:bg-pine-50"
              }`}
            >
              <span className="w-5 text-center" aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-magic p-4 text-cream">
        <p className="font-display text-sm font-semibold">Holiday season is coming</p>
        <p className="mt-1 text-xs text-cream/75">Lock in Santa letter automations before the December rush.</p>
        <Link
          href="/dashboard/automations"
          className="mt-3 inline-block rounded-full bg-gold-300 px-3 py-1.5 text-xs font-semibold text-pine-900"
        >
          Set it up →
        </Link>
      </div>
    </aside>
  );
}
