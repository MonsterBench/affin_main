import { NextResponse } from "next/server";
import { setVideoByToken } from "@/lib/db";

// Sentinel calls this when a personalized Santa video is ready.
// Body: { external_id: "<magicToken>", video_url: "https://…", status?: "ready" }
export async function POST(req: Request) {
  const secret = process.env.SENTINEL_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (provided !== secret) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const b = await req.json().catch(() => ({}));
  const token = String(b?.external_id ?? b?.token ?? "");
  const url = String(b?.video_url ?? b?.url ?? "");
  const status = String(b?.status ?? "ready");
  if (!token || !url) return NextResponse.json({ error: "external_id and video_url required" }, { status: 400 });

  const ok = await setVideoByToken(token, url, status);
  if (!ok) return NextResponse.json({ error: "unknown token" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
