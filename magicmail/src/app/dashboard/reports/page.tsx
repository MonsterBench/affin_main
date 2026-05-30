import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { requireUserId } from "@/lib/auth";
import { computeReport } from "@/lib/db";
import { currency } from "@/lib/format";
import { AUDIENCE_LABELS, OCCASION_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

function Bars({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-pine-600">{r.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-pine-50">
            <div className="h-full rounded-full bg-pine-500" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
          <span className="w-8 shrink-0 text-right text-sm font-medium text-pine-800">{r.count}</span>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-pine-400">No data yet.</p>}
    </div>
  );
}

export default async function ReportsPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const r = await computeReport(userId);

  const monthlyMax = Math.max(1, ...r.monthly.map((m) => m.count));

  return (
    <>
      <PageHeader
        title="Reports & ROI"
        subtitle="The proof: touches delivered, spend, and where your thoughtfulness is landing."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gifts delivered" value={String(r.delivered)} hint="this account, all time" accent />
        <StatCard label="In flight" value={String(r.inFlight)} hint={`${r.skipped} skipped`} />
        <StatCard label="Delivery rate" value={`${Math.round(r.deliveryRate * 100)}%`} hint="of released sends" />
        <StatCard label="Delivered spend" value={currency(r.spendDelivered)} hint={`${currency(r.spendScheduled)} scheduled`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Monthly trend */}
        <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-pine-800">Touches by month</h2>
          <div className="mt-5 flex h-40 items-end gap-3">
            {r.monthly.map((m) => (
              <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-pine-500"
                    style={{ height: `${(m.count / monthlyMax) * 100}%`, minHeight: m.count ? "4px" : "0" }}
                  />
                </div>
                <span className="text-xs text-pine-500">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top recipients */}
        <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-pine-800">Most-touched recipients</h2>
          <div className="mt-5">
            <Bars rows={r.topRecipients.map((t) => ({ label: t.name, count: t.count }))} />
          </div>
        </div>

        {/* By occasion */}
        <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-pine-800">By occasion</h2>
          <div className="mt-5">
            <Bars rows={r.byOccasion.map((o) => ({ label: OCCASION_LABELS[o.occasion], count: o.count }))} />
          </div>
        </div>

        {/* By audience */}
        <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-pine-800">By audience</h2>
          <div className="mt-5">
            <Bars rows={r.byAudience.map((a) => ({ label: AUDIENCE_LABELS[a.audience], count: a.count }))} />
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-pine-400">
        Tip: connect your CRM on the Integrations page to attribute referrals and retention back to touches.
      </p>
    </>
  );
}
