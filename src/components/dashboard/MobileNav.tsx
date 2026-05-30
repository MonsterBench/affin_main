"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/recipients", label: "Recipients" },
  { href: "/dashboard/automations", label: "Automations" },
  { href: "/dashboard/sends", label: "Pipeline" },
  { href: "/dashboard/catalog", label: "Catalog" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="border-b hairline bg-white px-4 py-3 lg:hidden">
      <Logo />
      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active ? "bg-pine-700 text-cream" : "bg-pine-50 text-pine-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
