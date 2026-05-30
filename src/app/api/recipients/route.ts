import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { addRecipient, listRecipients } from "@/lib/db";
import type { AudienceKind, ImportantDate } from "@/lib/types";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await listRecipients(userId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body?.firstName || !body?.lastName) {
    return NextResponse.json({ error: "firstName and lastName are required" }, { status: 400 });
  }
  const rec = await addRecipient(userId, {
    firstName: String(body.firstName),
    lastName: String(body.lastName),
    audience: (body.audience ?? "client") as AudienceKind,
    company: body.company || undefined,
    email: body.email || undefined,
    city: body.city ?? "",
    state: body.state ?? "",
    tags: Array.isArray(body.tags) ? body.tags : [],
    importantDates: Array.isArray(body.importantDates) ? (body.importantDates as ImportantDate[]) : [],
    notes: body.notes || undefined,
  });
  return NextResponse.json(rec, { status: 201 });
}
