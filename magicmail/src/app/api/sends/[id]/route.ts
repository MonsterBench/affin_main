import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { applySendAction } from "@/lib/db";
import type { SendAction } from "@/lib/types";

const VALID: SendAction[] = ["advance", "pause", "resume", "skip", "delay", "expedite"];

// PATCH applies a per-touch action: advance | pause | resume | skip | delay | expedite.
export async function PATCH(req: Request, ctx: RouteContext<"/api/sends/[id]">) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const action = (body?.action ?? "advance") as SendAction;
  if (!VALID.includes(action)) {
    return NextResponse.json({ error: "invalid action" }, { status: 400 });
  }

  const s = await applySendAction(userId, id, action);
  if (!s) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(s);
}
