import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SendsBoard } from "@/components/dashboard/SendsBoard";
import { requireUserId } from "@/lib/auth";
import { getProduct } from "@/lib/catalog";
import { listRecipients, listSends } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SendsPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const [sends, recipientList] = await Promise.all([listSends(userId), listRecipients(userId)]);

  const rows = sends.map((s) => {
    const r = recipientList.find((x) => x.id === s.recipientId);
    const p = getProduct(s.giftId);
    return {
      ...s,
      recipientName: r ? `${r.firstName} ${r.lastName}` : "Unknown",
      recipientFirstName: r?.firstName ?? "",
      productName: p?.name ?? "Gift",
      productEmoji: p?.emoji ?? "🎁",
    };
  });

  const recipients = recipientList.map((r) => ({
    id: r.id,
    name: `${r.firstName} ${r.lastName}`,
    firstName: r.firstName,
  }));

  return (
    <>
      <PageHeader
        title="Send pipeline"
        subtitle="Every gift from scheduled to delivered — handwriting, assembly, and tracking in one place."
      />
      <SendsBoard rows={rows} recipients={recipients} />
    </>
  );
}
