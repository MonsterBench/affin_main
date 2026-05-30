import { NextResponse } from "next/server";
import { advanceSend } from "@/lib/store";

// PATCH advances the send to the next stage of the fulfillment pipeline.
export async function PATCH(_req: Request, ctx: RouteContext<"/api/sends/[id]">) {
  const { id } = await ctx.params;
  const s = advanceSend(id);
  if (!s) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(s);
}
