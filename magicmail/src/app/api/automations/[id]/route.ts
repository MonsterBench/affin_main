import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { toggleAutomation } from "@/lib/db";

// PATCH toggles the automation's active state.
export async function PATCH(_req: Request, ctx: RouteContext<"/api/automations/[id]">) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const a = await toggleAutomation(userId, id);
  if (!a) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(a);
}
