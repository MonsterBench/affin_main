import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { pollFulfillmentStatuses } from "@/lib/db";

// Manual "Refresh status" — polls the provider for this account's dispatched
// orders and updates their status.
export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await pollFulfillmentStatuses({ userId });
  return NextResponse.json({ ok: true, ...result });
}
