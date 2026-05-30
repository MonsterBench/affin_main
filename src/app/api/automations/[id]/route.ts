import { NextResponse } from "next/server";
import { toggleAutomation } from "@/lib/store";

// PATCH toggles the automation's active state.
export async function PATCH(_req: Request, ctx: RouteContext<"/api/automations/[id]">) {
  const { id } = await ctx.params;
  const a = toggleAutomation(id);
  if (!a) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(a);
}
