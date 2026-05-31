"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ComposeSendButton } from "@/components/dashboard/ComposeSendButton";
import { logoutAction } from "@/app/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/recipients", label: "Recipients" },
  { href: "/dashboard/automations", label: "Automations" },
  { href: "/dashboard/sends", label: "Pipeline" },
  { href: "/dashboard/fulfillment", label: "Fulfillment" },
  { href: "/dashboard/catalog", label: "Catalog" },
  { href: "/dashboard/reports", label: "Reports" },
  { href: "/dashboard/integrations", label: "Integrations" },
  { href: "/dashboard/billing", label: "Billing" },
];

export function MobileNav({
  userName,
  recipients,
}: {
  userName: string;
  recipients: { id: string; name: string; firstName: string }[];
}) {
  const pathname = usePathname();
  return (
    <div className="border-b hairline bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-3">
          <ComposeSendButton recipients={recipients} label="Send" />
          <form action={logoutAction}>
            <button className="text-xs font-medium text-pine-500" title={userName}>
              Sign out
            </button>
          </form>
        </div>
      </div>
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
