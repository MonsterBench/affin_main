import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applySendAction } from "@/lib/db";
import { submitHandwriting } from "@/lib/handwriting";
import { validateAddress } from "@/lib/address";
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

  const r = send.recipient;

  // Never mail to an unvalidated address.
  const check = await validateAddress(r);
  if (!check.ok) {
    return NextResponse.json({ error: check.issues.join(" ") || "Invalid address." }, { status: 422 });
  }
  const addr = check.normalized ?? r;
  const address2 = addr.address2 ?? "";

  const result = await submitHandwriting({
    sendId: send.id,
    recipientName: `${r.firstName} ${r.lastName}`,
    address: formatAddress({ ...addr, address2 }),
    recipient: {
      name: `${r.firstName} ${r.lastName}`,
      address1: addr.address1,
      address2,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country ?? "US",
    },
    note: send.note,
    style: getProduct(send.giftId)?.category === "letter" ? "santa-script" : "casual-script",
  });

  // Record who's making it + the provider job, for operator tracking.
  await prisma.send.update({
    where: { id },
    data: {
      fulfillProvider: result.provider,
      fulfillJobId: result.jobId,
      fulfillStatus: result.status,
      dispatchedAt: new Date(),
    },
  });

  // Advance scheduled → handwriting so the pipeline reflects production.
  if (send.status === "scheduled") await applySendAction(userId, id, "advance");

  return NextResponse.json({ ok: true, ...result });
}
