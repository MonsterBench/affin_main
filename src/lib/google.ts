import "server-only";
import { appUrl } from "./urls";
import { toIsoDate } from "./importer";
import type { OccasionType } from "./types";

// Google Calendar integration.
//
// Live when GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET are set. Birthdays in Google
// live in a special read-only "Birthdays" calendar (sourced from Google
// Contacts) and are exposed through the Calendar API, so we list the user's
// calendars and pull birthday/anniversary events from each.

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const googleIsLive = Boolean(CLIENT_ID && CLIENT_SECRET);

// Read-only calendar + contacts access, plus the user's email for display.
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/contacts.readonly",
  "openid",
  "email",
];

export function googleRedirectUri(): string {
  return appUrl("/api/integrations/google/callback");
}

// Step 1: where to send the user to consent. `state` is our signed/opaque value.
export function googleAuthUrl(state: string): string {
  const p = new URLSearchParams({
    client_id: CLIENT_ID ?? "",
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline", // get a refresh token
    prompt: "consent", // ensure a refresh token even on re-consent
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p.toString()}`;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  error?: string;
}

// Step 2: exchange the auth code for tokens.
export async function exchangeCode(code: string): Promise<TokenResponse | null> {
  if (!googleIsLive) return null;
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        redirect_uri: googleRedirectUri(),
        grant_type: "authorization_code",
      }),
    });
    if (!res.ok) return null;
    return (await res.json()) as TokenResponse;
  } catch {
    return null;
  }
}

// Exchange a stored refresh token for a fresh access token (used on every sync).
export async function accessTokenFromRefresh(refreshToken: string): Promise<string | null> {
  if (!googleIsLive) return null;
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as TokenResponse;
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

// Decode the email from a Google id_token (no verification needed — it just
// came from Google over TLS in the token exchange).
export function emailFromIdToken(idToken?: string): string | undefined {
  if (!idToken) return undefined;
  try {
    const payload = idToken.split(".")[1];
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return json?.email;
  } catch {
    return undefined;
  }
}

interface GoogleEvent {
  summary?: string;
  start?: { date?: string; dateTime?: string };
}

export interface GoogleImportRow {
  firstName: string;
  lastName: string;
  importantDates: { occasion: OccasionType; date: string; label?: string }[];
}

// Pulls birthday/anniversary events from all of the user's calendars.
export async function fetchGoogleOccasions(accessToken: string): Promise<GoogleImportRow[]> {
  const calendars = await listCalendarIds(accessToken);
  const rows: GoogleImportRow[] = [];
  const now = new Date();
  const timeMin = new Date(now.getFullYear(), 0, 1).toISOString();
  const timeMax = new Date(now.getFullYear() + 1, 11, 31).toISOString();

  for (const calId of calendars) {
    const events = await listEvents(accessToken, calId, timeMin, timeMax);
    for (const ev of events) {
      const row = rowFromEvent(ev);
      if (row) rows.push(row);
    }
  }
  return dedupe(rows);
}

async function listCalendarIds(accessToken: string): Promise<string[]> {
  try {
    const res = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const ids: string[] = (data?.items ?? []).map((c: { id: string }) => c.id).filter(Boolean);
    // Always include the special birthdays calendar even if not in the list.
    if (!ids.includes("addressbook#contacts@group.v.calendar.google.com")) {
      ids.push("addressbook#contacts@group.v.calendar.google.com");
    }
    return ids;
  } catch {
    return [];
  }
}

async function listEvents(accessToken: string, calId: string, timeMin: string, timeMax: string): Promise<GoogleEvent[]> {
  try {
    const p = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: "true",
      maxResults: "2500",
    });
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events?${p.toString()}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.items ?? []) as GoogleEvent[];
  } catch {
    return [];
  }
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function rowFromEvent(ev: GoogleEvent): GoogleImportRow | null {
  const summary = (ev.summary ?? "").trim();
  if (!summary) return null;
  const s = summary.toLowerCase();
  const isBirthday = s.includes("birthday") || s.includes("🎂");
  const isAnniv = s.includes("anniversar");
  if (!isBirthday && !isAnniv) return null;

  const date = toIsoDate(ev.start?.date ?? ev.start?.dateTime ?? "");
  if (!date) return null;

  const nameText = summary
    .replace(/['’]s\b/gi, "")
    .replace(/\b(birthday|bday|anniversary|anniv)\b/gi, "")
    .replace(/🎂/g, "")
    .replace(/[-–—:]/g, " ")
    .trim();
  const { firstName, lastName } = splitName(nameText || summary);
  if (!firstName) return null;

  const occasion: OccasionType = isAnniv ? "milestone" : "birthday";
  return {
    firstName,
    lastName,
    importantDates: [{ occasion, date, label: isAnniv ? "Anniversary" : undefined }],
  };
}

// --- Google Contacts (People API) ------------------------------------------

interface PersonDate {
  year?: number;
  month?: number;
  day?: number;
}
interface Person {
  names?: { givenName?: string; familyName?: string; displayName?: string }[];
  birthdays?: { date?: PersonDate; text?: string }[];
  events?: { date?: PersonDate; type?: string; formattedType?: string }[];
}

function isoFromPersonDate(d?: PersonDate): string {
  if (!d || !d.month || !d.day) return "";
  const year = d.year ?? 2000; // year is cosmetic — matched by month/day
  return `${String(year).padStart(4, "0")}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

function nameFromPerson(p: Person): { firstName: string; lastName: string } | null {
  const n = p.names?.[0];
  if (!n) return null;
  if (n.givenName) return { firstName: n.givenName, lastName: n.familyName ?? "" };
  if (n.displayName) return splitName(n.displayName);
  return null;
}

// Pulls birthdays & anniversaries straight from the user's Google Contacts.
export async function fetchGoogleContacts(accessToken: string): Promise<GoogleImportRow[]> {
  const rows: GoogleImportRow[] = [];
  let pageToken = "";
  // Paginate through connections (People API caps page size at 1000).
  for (let guard = 0; guard < 20; guard++) {
    const p = new URLSearchParams({
      personFields: "names,birthdays,events",
      pageSize: "1000",
      sortOrder: "FIRST_NAME_ASCENDING",
    });
    if (pageToken) p.set("pageToken", pageToken);
    let data: { connections?: Person[]; nextPageToken?: string };
    try {
      const res = await fetch(`https://people.googleapis.com/v1/people/me/connections?${p.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) break;
      data = await res.json();
    } catch {
      break;
    }
    for (const person of data.connections ?? []) {
      const name = nameFromPerson(person);
      if (!name?.firstName) continue;

      const bday = isoFromPersonDate(person.birthdays?.[0]?.date);
      if (bday) {
        rows.push({ firstName: name.firstName, lastName: name.lastName, importantDates: [{ occasion: "birthday", date: bday }] });
      }
      for (const ev of person.events ?? []) {
        const isAnniv = (ev.type ?? ev.formattedType ?? "").toLowerCase().includes("anniversar");
        const date = isoFromPersonDate(ev.date);
        if (isAnniv && date) {
          rows.push({ firstName: name.firstName, lastName: name.lastName, importantDates: [{ occasion: "milestone", date, label: "Anniversary" }] });
        }
      }
    }
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }
  return dedupe(rows);
}

function dedupe(rows: GoogleImportRow[]): GoogleImportRow[] {
  const seen = new Set<string>();
  const out: GoogleImportRow[] = [];
  for (const r of rows) {
    const d = r.importantDates[0];
    const k = `${r.firstName}|${r.lastName}|${d.occasion}|${d.date.slice(5)}`.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}
