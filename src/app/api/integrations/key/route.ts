import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { getOrCreateApiKey, rotateApiKey } from "@/lib/db";

// GET returns (creating if needed) the account's API key.
export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ apiKey: await getOrCreateApiKey(userId) });
}

// POST rotates the API key.
export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ apiKey: await rotateApiKey(userId) });
}
