import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { advanceSend } from "@/lib/db";

// PATCH advances the send to the next stage of the fulfillment pipeline.
export async function PATCH(_req: Request, ctx: RouteContext<"/api/sends/[id]">) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const s = await advanceSend(userId, id);
  if (!s) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(s);
}
