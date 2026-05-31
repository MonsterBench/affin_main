import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { addAutomation, listAutomations } from "@/lib/db";
import type { AudienceKind, Cadence, OccasionType } from "@/lib/types";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await listAutomations(userId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body?.name || !body?.giftId) {
    return NextResponse.json({ error: "name and giftId are required" }, { status: 400 });
  }
  const a = await addAutomation(userId, {
    name: String(body.name),
    triggerOccasion: (body.triggerOccasion ?? "birthday") as OccasionType,
    giftId: String(body.giftId),
    leadTimeDays: Number(body.leadTimeDays ?? 5),
    audienceFilter: (body.audienceFilter ?? "all") as AudienceKind | "all",
    tagFilter: body.tagFilter || undefined,
    cadence: (body.cadence ?? "one_time") as Cadence,
    active: body.active ?? true,
    noteTemplate: String(body.noteTemplate ?? ""),
  });
  return NextResponse.json(a, { status: 201 });
}
