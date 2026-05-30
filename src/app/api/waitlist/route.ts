import { NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  await addToWaitlist(email, body?.source ? String(body.source) : "landing");
  return NextResponse.json({ ok: true }, { status: 201 });
}
