"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS, type PlanId } from "@/lib/plans";
import { currency } from "@/lib/format";

export function BillingPlans({
  currentPlan,
  live,
}: {
  currentPlan: PlanId;
  live: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<PlanId | null>(null);

  async function choose(plan: PlanId) {
    setBusy(plan);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.url) {
      window.location.assign(data.url); // hosted Stripe Checkout
      return;
    }
    setBusy(null);
    router.refresh(); // demo mode: plan changed in place
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {PLANS.map((plan) => {
        const isCurrent = plan.id === currentPlan;
        const featured = plan.id === "pro";
        return (
          <div
            key={plan.id}
            className={`flex flex-col rounded-2xl border p-6 shadow-card ${
              featured ? "border-pine-600 bg-pine-700 text-cream" : "border-pine-100 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`font-display text-lg font-semibold ${featured ? "text-cream" : "text-pine-800"}`}>
                {plan.name}
              </h3>
              {isCurrent && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  featured ? "bg-gold-300 text-pine-900" : "bg-pine-100 text-pine-700"
                }`}>
                  Current
                </span>
              )}
            </div>
            <p className={`mt-1 text-sm ${featured ? "text-cream/75" : "text-pine-600/90"}`}>{plan.blurb}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-3xl font-semibold">
                {plan.price === 0 ? "$0" : currency(plan.price)}
              </span>
              <span className={`text-sm ${featured ? "text-cream/70" : "text-pine-500"}`}>
                {plan.price === 0 ? "+ gifts" : "/mo + gifts"}
              </span>
            </div>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className={featured ? "text-gold-300" : "text-pine-600"}>✓</span>
                  <span className={featured ? "text-cream/90" : "text-pine-700"}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => choose(plan.id)}
              disabled={isCurrent || busy !== null}
              className={`mt-6 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition disabled:opacity-50 ${
                featured ? "bg-gold-300 text-pine-900 hover:bg-gold-200" : "bg-pine-700 text-cream hover:bg-pine-600"
              }`}
            >
              {isCurrent
                ? "Your plan"
                : busy === plan.id
                  ? "Working…"
                  : plan.price === 0
                    ? "Downgrade"
                    : live
                      ? "Upgrade"
                      : "Upgrade (demo)"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
