import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { addSend, listSends } from "@/lib/db";
import type { OccasionType } from "@/lib/types";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await listSends(userId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body?.recipientId || !body?.giftId) {
    return NextResponse.json({ error: "recipientId and giftId are required" }, { status: 400 });
  }
  const s = await addSend(userId, {
    recipientId: String(body.recipientId),
    giftId: String(body.giftId),
    occasion: (body.occasion ?? "just_because") as OccasionType,
    status: "scheduled",
    scheduledFor: String(body.scheduledFor ?? new Date().toISOString().slice(0, 10)),
    note: String(body.note ?? ""),
    automationId: body.automationId || undefined,
  });
  if (!s) return NextResponse.json({ error: "recipient not found" }, { status: 404 });
  return NextResponse.json(s, { status: 201 });
}
