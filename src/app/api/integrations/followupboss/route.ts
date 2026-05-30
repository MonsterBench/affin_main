import { NextResponse } from "next/server";
import { triggerFromEvent, userIdForApiKey, getFubApiKey } from "@/lib/db";
import { mapFubEvent, fetchFubResource, type FubContact } from "@/lib/followupboss";

// Native Follow Up Boss webhook receiver.
//
// Register this URL (with ?key=YOUR_KRINGLE_API_KEY) as a webhook in Follow Up
// Boss. On an event we map it to an occasion, fetch the contact from FUB using
// your stored FUB API key, and fire matching automations.
//
// For testing without FUB, you can POST contact fields directly in the body.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const ourKey =
    url.searchParams.get("key") ||
    req.headers.get("x-api-key") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const userId = await userIdForApiKey(String(ourKey ?? ""));
  if (!userId) return NextResponse.json({ error: "invalid or missing API key" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const event = String(body?.event ?? "peopleCreated");

  // Resolve the contact: prefer the FUB API (real webhooks send only a URI),
  // fall back to fields included directly in the body (test mode).
  let contact: FubContact | null = null;
  const fubKey = await getFubApiKey(userId);
  if (body?.uri && fubKey) {
    contact = await fetchFubResource(String(body.uri), fubKey);
  }
  if (!contact && body?.firstName) {
    contact = {
      firstName: String(body.firstName),
      lastName: String(body.lastName ?? ""),
      email: body.email ? String(body.email) : undefined,
      address1: body.address1 ? String(body.address1) : undefined,
      city: body.city ? String(body.city) : undefined,
      state: body.state ? String(body.state) : undefined,
      zip: body.zip ? String(body.zip) : undefined,
      stage: body.stage ? String(body.stage) : undefined,
    };
  }
  if (!contact?.firstName) {
    return NextResponse.json({ error: "could not resolve contact (check FUB key or include fields)" }, { status: 400 });
  }

  const occasion = mapFubEvent(event, contact.stage);
  if (!occasion) {
    return NextResponse.json({ ok: true, skipped: true, message: `No gift mapping for event “${event}”.` });
  }

  const result = await triggerFromEvent(userId, {
    occasion,
    firstName: contact.firstName,
    lastName: contact.lastName || "—",
    email: contact.email,
    address1: contact.address1,
    city: contact.city,
    state: contact.state,
    zip: contact.zip,
    tags: ["follow-up-boss", "real-estate"],
  });

  return NextResponse.json({
    ok: true,
    occasion,
    scheduled: result.scheduled,
    message:
      result.matchedAutomations > 0
        ? `Scheduled ${result.matchedAutomations} gift(s) from Follow Up Boss.`
        : "Contact saved. No active automation matched yet.",
  });
}
