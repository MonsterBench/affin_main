import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { setFubApiKey, getFubApiKey } from "@/lib/db";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const key = await getFubApiKey(userId);
  return NextResponse.json({ connected: Boolean(key) });
}

// Save or clear the account's Follow Up Boss API key.
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  await setFubApiKey(userId, body?.fubApiKey ? String(body.fubApiKey) : null);
  return NextResponse.json({ ok: true, connected: Boolean(body?.fubApiKey) });
}
