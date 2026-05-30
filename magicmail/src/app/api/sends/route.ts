import { NextResponse } from "next/server";
import { addSend, listSends } from "@/lib/store";
import type { OccasionType } from "@/lib/types";

export async function GET() {
  return NextResponse.json(listSends());
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.recipientId || !body?.giftId) {
    return NextResponse.json({ error: "recipientId and giftId are required" }, { status: 400 });
  }
  const s = addSend({
    recipientId: String(body.recipientId),
    giftId: String(body.giftId),
    occasion: (body.occasion ?? "just_because") as OccasionType,
    status: "scheduled",
    scheduledFor: String(body.scheduledFor ?? new Date().toISOString().slice(0, 10)),
    note: String(body.note ?? ""),
    automationId: body.automationId || undefined,
  });
  return NextResponse.json(s, { status: 201 });
}
