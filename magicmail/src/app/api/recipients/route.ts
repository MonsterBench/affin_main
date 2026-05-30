import { NextResponse } from "next/server";
import { addRecipient, listRecipients } from "@/lib/store";
import type { AudienceKind, ImportantDate } from "@/lib/types";

export async function GET() {
  return NextResponse.json(listRecipients());
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.firstName || !body?.lastName) {
    return NextResponse.json({ error: "firstName and lastName are required" }, { status: 400 });
  }
  const rec = addRecipient({
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
