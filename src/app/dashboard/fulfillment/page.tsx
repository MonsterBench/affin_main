import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FulfillmentQueue, type Order } from "@/components/dashboard/FulfillmentQueue";
import { requireUserId } from "@/lib/auth";
import { getProduct } from "@/lib/catalog";
import { listRecipients, listSends } from "@/lib/db";
import { activeProvider } from "@/lib/handwriting";
import { formatAddress } from "@/lib/types";

export const dynamic = "force-dynamic";

const FULFILLABLE = ["scheduled", "handwriting", "assembling"];

export default async function FulfillmentPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const [sends, recipients] = await Promise.all([listSends(userId), listRecipients(userId)]);

  const orders: Order[] = sends
    .filter((s) => FULFILLABLE.includes(s.status))
    .map((s) => {
      const r = recipients.find((x) => x.id === s.recipientId);
      const p = getProduct(s.giftId);
      const address = r ? formatAddress(r) : "";
      return {
        id: s.id,
        recipientName: r ? `${r.firstName} ${r.lastName}` : "Unknown",
        address,
        addressMissing: !r?.address1,
        gift: p?.name ?? "Gift",
        emoji: p?.emoji ?? "🎁",
        occasion: s.occasion,
        isLetter: p?.category === "letter",
        status: s.status,
        scheduledFor: s.scheduledFor,
        note: s.note,
      };
    });

  return (
    <>
      <PageHeader
        title="Fulfillment"
        subtitle="The production backend: every order with its mailing address and AI-written note, ready for the auto-pen."
      />
      <FulfillmentQueue orders={orders} provider={activeProvider()} />
    </>
  );
}
