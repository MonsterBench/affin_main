import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { disconnectGoogle, getGoogleConnection } from "@/lib/db";
import { syncGoogleForUser } from "@/lib/googleSync";
import { prisma } from "@/lib/prisma";

// GET: connection status. POST {action:"sync"|"disconnect"}.
export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getGoogleConnection(userId));
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { action } = await req.json().catch(() => ({ action: "" }));

  if (action === "disconnect") {
    await disconnectGoogle(userId);
    return NextResponse.json({ ok: true, connected: false });
  }
  if (action === "sync") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.googleRefreshToken) {
      return NextResponse.json({ error: "Google isn't connected." }, { status: 400 });
    }
    const result = await syncGoogleForUser(userId, user.googleRefreshToken);
    return NextResponse.json(result);
  }
  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
