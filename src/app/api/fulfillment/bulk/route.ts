import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applySendAction } from "@/lib/db";
import { submitHandwriting } from "@/lib/handwriting";
import { validateAddress } from "@/lib/address";
import { getProduct } from "@/lib/catalog";
import { formatAddress } from "@/lib/types";

// Send every scheduled gift with a valid address to the auto-pen at once.
export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const due = await prisma.send.findMany({
    where: { userId, status: "scheduled" },
    include: { recipient: true },
  });

  let sent = 0;
  let skipped = 0;
  for (const s of due) {
    const check = await validateAddress(s.recipient);
    if (!check.ok) {
      skipped++;
      continue;
    }
    const addr = check.normalized ?? s.recipient;
    const address2 = addr.address2 ?? "";
    await submitHandwriting({
      sendId: s.id,
      recipientName: `${s.recipient.firstName} ${s.recipient.lastName}`,
      address: formatAddress({ ...addr, address2 }),
      recipient: {
        name: `${s.recipient.firstName} ${s.recipient.lastName}`,
        address1: addr.address1,
        address2,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: addr.country ?? "US",
      },
      note: s.note,
      style: getProduct(s.giftId)?.category === "letter" ? "santa-script" : "casual-script",
    });
    await applySendAction(userId, s.id, "advance");
    sent++;
  }

  return NextResponse.json({ ok: true, sent, skipped });
}
