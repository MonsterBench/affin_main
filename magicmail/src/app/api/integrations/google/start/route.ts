import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { googleAuthUrl, googleIsLive } from "@/lib/google";

// Kicks off Google OAuth. We pass the userId as `state` so the callback knows
// who's connecting (the session cookie is also present, but state is the
// canonical OAuth correlation value).
export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  if (!googleIsLive) {
    return NextResponse.json({ error: "Google Calendar isn't configured on this server." }, { status: 503 });
  }
  return NextResponse.redirect(googleAuthUrl(userId));
}
