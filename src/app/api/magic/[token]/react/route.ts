import { NextResponse } from "next/server";
import { addReactionByToken } from "@/lib/db";

// Public — the recipient/parent leaves a reaction on the keepsake page.
export async function POST(req: Request, ctx: RouteContext<"/api/magic/[token]/react">) {
  const { token } = await ctx.params;
  const b = await req.json().catch(() => ({}));
  const emoji = b?.emoji ? String(b.emoji).slice(0, 8) : undefined;
  const message = b?.message ? String(b.message) : undefined;
  const fromName = b?.fromName ? String(b.fromName) : undefined;

  if (!emoji && !message) {
    return NextResponse.json({ error: "Add an emoji or a short message." }, { status: 400 });
  }
  const ok = await addReactionByToken(token, { emoji, message, fromName });
  if (!ok) return NextResponse.json({ error: "This magic link isn't valid." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
