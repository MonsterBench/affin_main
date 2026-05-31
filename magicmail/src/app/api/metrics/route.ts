import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { computeMetrics } from "@/lib/db";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await computeMetrics(userId));
}
