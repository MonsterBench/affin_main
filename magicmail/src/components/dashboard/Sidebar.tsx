"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/app/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "◈", exact: true },
  { href: "/dashboard/recipients", label: "Recipients", icon: "👥" },
  { href: "/dashboard/automations", label: "Automations", icon: "⚡" },
  { href: "/dashboard/sends", label: "Send pipeline", icon: "📦" },
  { href: "/dashboard/fulfillment", label: "Fulfillment", icon: "✍️" },
  { href: "/dashboard/catalog", label: "Gift catalog", icon: "🎁" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "🔗" },
  { href: "/dashboard/billing", label: "Billing", icon: "💳" },
];

const PLAN_LABEL: Record<string, string> = {
  free: "Magic Mail Club",
  pro: "Professional",
  business: "Business",
};

export function Sidebar({
  userName,
  userEmail,
  plan,
}: {
  userName: string;
  userEmail: string;
  plan: string;
}) {
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
                active ? "bg-pine-700 text-cream shadow-card" : "text-pine-700 hover:bg-pine-50"
              }`}
            >
              <span className="w-5 text-center" aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-pine-100 bg-cream/60 p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine-700 text-xs font-semibold text-cream">
              {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-pine-800">{userName}</p>
              <p className="truncate text-xs text-pine-500">{userEmail}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-600">
              {PLAN_LABEL[plan] ?? plan}
            </span>
            <form action={logoutAction}>
              <button className="text-xs font-medium text-pine-500 transition hover:text-berry-500">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
