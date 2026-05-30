import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { OccasionBadge, StatusBadge } from "@/components/ui/Badge";
import { requireUserId } from "@/lib/auth";
import { getProduct } from "@/lib/catalog";
import { currency, shortDate } from "@/lib/format";
import { computeMetrics, listAutomations, listRecipients, listSends } from "@/lib/db";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/types";

// Reads the live database, so render on each request rather than at build.
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const [m, sends, automations, recipients] = await Promise.all([
    computeMetrics(userId),
    listSends(userId),
    listAutomations(userId),
    listRecipients(userId),
  ]);
  const nameOf = (id: string) => {
    const r = recipients.find((x) => x.id === id);
    return r ? `${r.firstName} ${r.lastName}` : "Unknown";
  };

  const now = new Date();
  const upcoming = sends
    .filter((s) => s.status !== "delivered" && new Date(s.scheduledFor + "T00:00:00") >= new Date(now.toDateString()))
    .slice(0, 5);

  const pipelineCounts = STATUS_ORDER.map((status) => ({
    status,
    count: sends.filter((s) => s.status === status).length,
  }));
  const pipelineTotal = sends.length || 1;

  return (
    <>
      <PageHeader
        title="Good to see you 👋"
        subtitle="Here's the magic in motion across your accounts."
        action={
          <Link
            href="/dashboard/sends"
            className="rounded-full bg-pine-700 px-4 py-2 text-sm font-semibold text-cream shadow-card transition hover:bg-pine-600"
          >
            + New send
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Recipients" value={String(m.recipients)} hint="across all audiences" />
        <StatCard label="Active automations" value={String(m.activeAutomations)} hint="watching the calendar" />
        <StatCard label="In flight" value={String(m.inFlight)} hint={`${m.upcoming} in the next 30 days`} accent />
        <StatCard
          label="Scheduled value"
          value={currency(m.revenueScheduled)}
          hint={`${Math.round(m.marginRate * 100)}% blended margin`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Upcoming sends */}
        <div className="lg:col-span-2 rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-pine-800">Upcoming sends</h2>
            <Link href="/dashboard/sends" className="text-sm font-medium text-pine-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-4 divide-y divide-pine-50">
            {upcoming.length === 0 && (
              <p className="py-8 text-center text-sm text-pine-500">Nothing scheduled yet. Create your first send.</p>
            )}
            {upcoming.map((s) => {
              const p = getProduct(s.giftId);
              return (
                <div key={s.id} className="flex items-center gap-4 py-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine-50 text-xl">
                    {p?.emoji ?? "🎁"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-pine-800">
                      {nameOf(s.recipientId)} · {p?.name}
                    </p>
                    <p className="text-xs text-pine-500">Mails {shortDate(s.scheduledFor)}</p>
                  </div>
                  <OccasionBadge occasion={s.occasion} />
                  <StatusBadge status={s.status} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline + automations */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-pine-800">Pipeline</h2>
            <div className="mt-4 space-y-3">
              {pipelineCounts.map(({ status, count }) => (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pine-600">{STATUS_LABELS[status]}</span>
                    <span className="font-medium text-pine-800">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-pine-50">
                    <div
                      className="h-full rounded-full bg-pine-500"
                      style={{ width: `${(count / pipelineTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-pine-800">Automations</h2>
            <ul className="mt-4 space-y-3">
              {automations.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-center gap-3 text-sm">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${a.active ? "bg-emerald-500" : "bg-pine-200"}`} />
                  <span className="min-w-0 flex-1 truncate text-pine-700">{a.name}</span>
                  <span className="text-xs text-pine-400">{a.active ? "On" : "Off"}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/automations"
              className="mt-4 inline-block text-sm font-medium text-pine-600 hover:underline"
            >
              Manage automations →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
