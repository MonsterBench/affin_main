import { NextResponse } from "next/server";
import { triggerFromEvent, userIdForApiKey, logIntegrationEvent } from "@/lib/db";
import { OCCASION_LABELS, type OccasionType } from "@/lib/types";

// Public inbound webhook for CRMs and Zapier.
//
// Authenticate with your API key via `Authorization: Bearer <key>`,
// an `x-api-key` header, or an `apiKey` field in the JSON body.
//
// Example body:
//   { "event": "closing", "firstName": "Marcus", "lastName": "Reed",
//     "email": "marcus@reedco.com", "tags": ["vip","real-estate"], "date": "2026-06-04" }
//
// We upsert the recipient and fire any matching active automations.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const headerKey =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    req.headers.get("x-api-key") ||
    body?.apiKey;
  const userId = await userIdForApiKey(String(headerKey ?? ""));
  if (!userId) return NextResponse.json({ error: "invalid or missing API key" }, { status: 401 });

  const occasion = String(body?.event ?? body?.occasion ?? "") as OccasionType;
  if (!Object.keys(OCCASION_LABELS).includes(occasion)) {
    return NextResponse.json(
      { error: `unknown event; expected one of: ${Object.keys(OCCASION_LABELS).join(", ")}` },
      { status: 400 },
    );
  }
  if (!body?.firstName || !body?.lastName) {
    return NextResponse.json({ error: "firstName and lastName are required" }, { status: 400 });
  }

  const result = await triggerFromEvent(userId, {
    occasion,
    firstName: String(body.firstName),
    lastName: String(body.lastName),
    email: body.email ? String(body.email) : undefined,
    company: body.company ? String(body.company) : undefined,
    city: body.city ? String(body.city) : undefined,
    state: body.state ? String(body.state) : undefined,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : undefined,
    date: body.date ? String(body.date) : undefined,
  });

  const message =
    result.matchedAutomations > 0
      ? `Scheduled ${result.matchedAutomations} gift(s).`
      : "Recipient saved. No active automation matched this event yet.";

  await logIntegrationEvent(userId, {
    source: "api",
    event: occasion,
    summary: `${body.firstName} ${body.lastName} — ${message}`,
    sendsCreated: result.matchedAutomations,
  });

  return NextResponse.json({ ok: true, recipientId: result.recipientId, scheduled: result.scheduled, message }, { status: 200 });
}
