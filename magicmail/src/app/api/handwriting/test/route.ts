import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { testHandwritingConnection } from "@/lib/handwriting";

// Lets an operator verify the live handwriting/mailing connection from the UI.
export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await testHandwritingConnection());
}
