import { PageHeader } from "@/components/dashboard/PageHeader";
import { SendsBoard } from "@/components/dashboard/SendsBoard";
import { CATALOG, getProduct } from "@/lib/catalog";
import { listRecipients, listSends } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function SendsPage() {
  const sends = listSends();
  const recipientList = listRecipients();

  const rows = sends.map((s) => {
    const r = recipientList.find((x) => x.id === s.recipientId);
    const p = getProduct(s.giftId);
    return {
      ...s,
      recipientName: r ? `${r.firstName} ${r.lastName}` : "Unknown",
      productName: p?.name ?? "Gift",
      productEmoji: p?.emoji ?? "🎁",
    };
  });

  const recipients = recipientList.map((r) => ({ id: r.id, name: `${r.firstName} ${r.lastName}` }));
  const products = CATALOG.map((p) => ({ id: p.id, name: p.name, emoji: p.emoji }));

  return (
    <>
      <PageHeader
        title="Send pipeline"
        subtitle="Every gift from scheduled to delivered — handwriting, assembly, and tracking in one place."
      />
      <SendsBoard rows={rows} recipients={recipients} products={products} />
    </>
  );
}
