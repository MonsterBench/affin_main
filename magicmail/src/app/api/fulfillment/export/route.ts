import { requireUserId } from "@/lib/auth";
import { listRecipients, listSends } from "@/lib/db";
import { getProduct } from "@/lib/catalog";
import { OCCASION_LABELS } from "@/lib/types";

function csvCell(v: string): string {
  return `"${(v ?? "").replaceAll('"', '""')}"`;
}

// Exports the open fulfillment queue (orders + addresses + notes) as CSV — the
// hand-off for an operator, 3PL, or the handwriting provider.
export async function GET() {
  const userId = await requireUserId();
  if (!userId) return new Response("unauthorized", { status: 401 });

  const [sends, recipients] = await Promise.all([listSends(userId), listRecipients(userId)]);
  const open = sends.filter((s) => ["scheduled", "handwriting", "assembling"].includes(s.status));

  const header = [
    "send_id", "status", "mail_date", "gift", "occasion",
    "recipient", "address1", "address2", "city", "state", "zip", "country", "note",
  ];
  const lines = [header.join(",")];

  for (const s of open) {
    const r = recipients.find((x) => x.id === s.recipientId);
    const p = getProduct(s.giftId);
    lines.push(
      [
        s.id, s.status, s.scheduledFor, p?.name ?? s.giftId, OCCASION_LABELS[s.occasion],
        r ? `${r.firstName} ${r.lastName}` : "Unknown",
        r?.address1 ?? "", r?.address2 ?? "", r?.city ?? "", r?.state ?? "", r?.zip ?? "", r?.country ?? "",
        s.note,
      ]
        .map((v) => csvCell(String(v)))
        .join(","),
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="kringle-fulfillment-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
