import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ComposeSendButton } from "@/components/dashboard/ComposeSendButton";
import { OccasionBadge, StatusBadge, Tag } from "@/components/ui/Badge";
import { requireUserId } from "@/lib/auth";
import { getProduct } from "@/lib/catalog";
import { getRecipient, sendsForRecipient, listRecipients } from "@/lib/db";
import { currency, initials, longDate, shortDate, daysUntilRecurring } from "@/lib/format";
import { AUDIENCE_LABELS, formatAddress } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RecipientPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const { id } = await params;

  const [recipient, sends, all] = await Promise.all([
    getRecipient(userId, id),
    sendsForRecipient(userId, id),
    listRecipients(userId),
  ]);
  if (!recipient) notFound();

  const recipientLites = all.map((r) => ({ id: r.id, name: `${r.firstName} ${r.lastName}`, firstName: r.firstName }));
  const delivered = sends.filter((s) => s.status === "delivered").length;
  const totalSpend = sends
    .filter((s) => s.status !== "skipped")
    .reduce((t, s) => t + (getProduct(s.giftId)?.price ?? 0), 0);

  const upcomingDates = [...recipient.importantDates]
    .map((d) => ({ ...d, away: daysUntilRecurring(d.date) }))
    .sort((a, b) => a.away - b.away);

  return (
    <>
      <Link href="/dashboard/recipients" className="text-sm font-medium text-pine-600 hover:underline">
        ← All recipients
      </Link>

      <div className="mt-3">
        <PageHeader
          title={`${recipient.firstName} ${recipient.lastName}`}
          subtitle={recipient.company || AUDIENCE_LABELS[recipient.audience]}
          action={
            <ComposeSendButton recipients={recipientLites} label="Send a gift" preset={{ recipientId: recipient.id }} />
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pine-100 text-sm font-semibold text-pine-700">
                {initials(recipient.firstName, recipient.lastName)}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-pine-800">{recipient.firstName} {recipient.lastName}</p>
                <p className="text-xs text-pine-500">{AUDIENCE_LABELS[recipient.audience]}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              {recipient.email && (
                <div><dt className="text-pine-400">Email</dt><dd className="text-pine-700">{recipient.email}</dd></div>
              )}
              {recipient.address1 && (
                <div><dt className="text-pine-400">Address</dt><dd className="text-pine-700">{formatAddress(recipient)}</dd></div>
              )}
              {recipient.notes && (
                <div><dt className="text-pine-400">Notes</dt><dd className="text-pine-700">{recipient.notes}</dd></div>
              )}
            </dl>
            {recipient.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {recipient.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-pine-50 pt-4 text-center">
              <div><p className="font-display text-xl font-semibold text-pine-800">{delivered}</p><p className="text-xs text-pine-500">delivered</p></div>
              <div><p className="font-display text-xl font-semibold text-pine-800">{currency(totalSpend)}</p><p className="text-xs text-pine-500">total spend</p></div>
            </div>
          </div>

          {/* Important dates */}
          <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-base font-semibold text-pine-800">Important dates</h2>
            <ul className="mt-3 space-y-2">
              {upcomingDates.length === 0 && <li className="text-sm text-pine-400">None on file.</li>}
              {upcomingDates.map((d) => (
                <li key={`${d.occasion}:${d.date}`} className="flex items-center justify-between gap-2 text-sm">
                  <OccasionBadge occasion={d.occasion} />
                  <span className="text-pine-500">{shortDate(d.date)} · {d.away === 0 ? "today" : `${d.away}d`}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-pine-800">Gifting timeline</h2>
          {sends.length === 0 ? (
            <p className="mt-6 rounded-xl bg-pine-50 px-4 py-6 text-center text-sm text-pine-500">
              No gifts yet. Be the first to make {recipient.firstName}&apos;s day.
            </p>
          ) : (
            <ol className="mt-5 space-y-5 border-l border-pine-100 pl-5">
              {sends.map((s) => {
                const p = getProduct(s.giftId);
                return (
                  <li key={s.id} className="relative">
                    <span className="absolute -left-[27px] grid h-9 w-9 place-items-center rounded-full bg-pine-50 text-base ring-4 ring-white">
                      {p?.emoji ?? "🎁"}
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-pine-800">{p?.name ?? "Gift"}</p>
                      <StatusBadge status={s.status} />
                    </div>
                    <p className="text-xs text-pine-500">
                      {s.status === "delivered" && s.deliveredOn ? `Delivered ${longDate(s.deliveredOn)}` : `Mails ${longDate(s.scheduledFor)}`}
                    </p>
                    {s.note && (
                      <p className="mt-1.5 rounded-xl bg-cream/60 p-2.5 text-xs italic text-pine-600">“{s.note}”</p>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </>
  );
}
