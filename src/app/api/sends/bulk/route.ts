import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { addSend } from "@/lib/db";
import type { OccasionType } from "@/lib/types";

// Schedule the same gift to many recipients at once (bulk gifting).
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const recipientIds: string[] = Array.isArray(body?.recipientIds) ? body.recipientIds.map(String) : [];
  if (recipientIds.length === 0 || !body?.giftId) {
    return NextResponse.json({ error: "recipientIds and giftId are required" }, { status: 400 });
  }

  const occasion = (body.occasion ?? "just_because") as OccasionType;
  const scheduledFor = String(body.scheduledFor ?? new Date().toISOString().slice(0, 10));
  const note = String(body.note ?? "");

  let scheduled = 0;
  for (const recipientId of recipientIds) {
    // addSend verifies the recipient belongs to this account.
    const s = await addSend(userId, {
      recipientId,
      giftId: String(body.giftId),
      occasion,
      status: "scheduled",
      scheduledFor,
      note,
    });
    if (s) scheduled++;
  }

  return NextResponse.json({ ok: true, scheduled }, { status: 201 });
}
