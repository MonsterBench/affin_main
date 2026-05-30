import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { runScheduler } from "@/lib/scheduler";

// In-app "Run scheduler now" — runs the engine for the current account only,
// so you can watch recurring touches, notifications, and auto-release work.
export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const summary = await runScheduler({ userId });
  return NextResponse.json({ ok: true, ...summary });
}
