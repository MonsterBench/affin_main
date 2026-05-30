import { NextResponse } from "next/server";
import { addAutomation, listAutomations } from "@/lib/store";
import type { AudienceKind, OccasionType } from "@/lib/types";

export async function GET() {
  return NextResponse.json(listAutomations());
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.name || !body?.giftId) {
    return NextResponse.json({ error: "name and giftId are required" }, { status: 400 });
  }
  const a = addAutomation({
    name: String(body.name),
    triggerOccasion: (body.triggerOccasion ?? "birthday") as OccasionType,
    giftId: String(body.giftId),
    leadTimeDays: Number(body.leadTimeDays ?? 5),
    audienceFilter: (body.audienceFilter ?? "all") as AudienceKind | "all",
    tagFilter: body.tagFilter || undefined,
    active: body.active ?? true,
    noteTemplate: String(body.noteTemplate ?? ""),
  });
  return NextResponse.json(a, { status: 201 });
}
