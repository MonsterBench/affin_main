import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AddRecipientButton } from "@/components/dashboard/AddRecipientButton";
import { ImportRecipientsButton } from "@/components/dashboard/ImportRecipientsButton";
import { OccasionBadge, Tag } from "@/components/ui/Badge";
import { requireUserId } from "@/lib/auth";
import { initials, shortDate } from "@/lib/format";
import { listRecipients } from "@/lib/db";
import { AUDIENCE_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RecipientsPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const recipients = await listRecipients(userId);

  return (
    <>
      <PageHeader
        title="Recipients"
        subtitle={`${recipients.length} people on your thoughtfulness list`}
        action={
          <div className="flex items-center gap-2">
            <ImportRecipientsButton />
            <AddRecipientButton />
          </div>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-pine-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b hairline text-left text-xs uppercase tracking-wide text-pine-500">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Audience</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Location</th>
              <th className="px-5 py-3 font-medium">Next occasion</th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pine-50">
            {recipients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-pine-500">
                  No recipients yet. Add your first one to get started.
                </td>
              </tr>
            )}
            {recipients.map((r) => {
              const next = [...r.importantDates].sort((a, b) =>
                a.date.slice(5).localeCompare(b.date.slice(5)),
              )[0];
              return (
                <tr key={r.id} className="transition hover:bg-cream/60">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine-100 text-xs font-semibold text-pine-700">
                        {initials(r.firstName, r.lastName)}
                      </span>
                      <div className="min-w-0">
                        <Link href={`/dashboard/recipients/${r.id}`} className="font-medium text-pine-800 hover:underline">
                          {r.firstName} {r.lastName}
                        </Link>
                        {r.company && <p className="truncate text-xs text-pine-500">{r.company}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 sm:table-cell">
                    <span className="rounded-full bg-pine-50 px-2.5 py-0.5 text-xs font-medium text-pine-700">
                      {AUDIENCE_LABELS[r.audience]}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-pine-600 md:table-cell">
                    {r.city}{r.state ? `, ${r.state}` : ""}
                  </td>
                  <td className="px-5 py-3.5">
                    {next ? (
                      <div className="flex flex-col gap-1">
                        <OccasionBadge occasion={next.occasion} />
                        <span className="text-xs text-pine-500">{shortDate(next.date)}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-pine-400">—</span>
                    )}
                  </td>
                  <td className="hidden px-5 py-3.5 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
