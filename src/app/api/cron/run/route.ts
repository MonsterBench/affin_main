import { NextResponse } from "next/server";
import { runScheduler } from "@/lib/scheduler";
import { pollFulfillmentStatuses } from "@/lib/db";

// Cron entrypoint — point a scheduler (e.g. Vercel Cron, daily) at this route.
// Protected by CRON_SECRET when set. Runs the auto-send engine for all accounts.
export async function GET(req: Request) {
  return handle(req);
}
export async function POST(req: Request) {
  return handle(req);
}

async function handle(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const provided = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (provided !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const summary = await runScheduler();
  const polled = await pollFulfillmentStatuses();
  return NextResponse.json({ ok: true, ...summary, polled });
}
