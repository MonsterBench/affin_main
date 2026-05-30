import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applySendAction } from "@/lib/db";
import { submitHandwriting } from "@/lib/handwriting";
import { getProduct } from "@/lib/catalog";
import { formatAddress } from "@/lib/types";

// Sends the AI-written note to the handwriting / auto-pen provider, then moves
// the send into the "handwriting" stage of the pipeline.
export async function POST(_req: Request, ctx: RouteContext<"/api/fulfillment/[id]">) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const send = await prisma.send.findFirst({ where: { id, userId }, include: { recipient: true } });
  if (!send) return NextResponse.json({ error: "not found" }, { status: 404 });

  const result = await submitHandwriting({
    sendId: send.id,
    recipientName: `${send.recipient.firstName} ${send.recipient.lastName}`,
    address: formatAddress(send.recipient),
    note: send.note,
    style: getProduct(send.giftId)?.category === "letter" ? "santa-script" : "casual-script",
  });

  // Advance scheduled → handwriting so the pipeline reflects production.
  if (send.status === "scheduled") await applySendAction(userId, id, "advance");

  return NextResponse.json({ ok: true, ...result });
}
