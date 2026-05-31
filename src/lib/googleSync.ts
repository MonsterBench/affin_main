import "server-only";
import { accessTokenFromRefresh, fetchGoogleOccasions, fetchGoogleContacts } from "./google";
import { importRecipients, markGoogleSynced, usersWithGoogle } from "./db";

export interface GoogleSyncResult {
  ok: boolean;
  created: number;
  merged: number;
  datesAdded: number;
  error?: string;
}

// Runs a one-shot Google Calendar sync for a single user: refresh the access
// token, pull birthday/anniversary events, and import them (create/merge).
export async function syncGoogleForUser(userId: string, refreshToken: string): Promise<GoogleSyncResult> {
  const accessToken = await accessTokenFromRefresh(refreshToken);
  if (!accessToken) return { ok: false, created: 0, merged: 0, datesAdded: 0, error: "Couldn't refresh Google access." };

  // Pull from both the calendar (incl. the Birthdays calendar) and Contacts,
  // then let importRecipients create/merge and dedupe.
  const [calendarRows, contactRows] = await Promise.all([
    fetchGoogleOccasions(accessToken),
    fetchGoogleContacts(accessToken),
  ]);
  const result = await importRecipients(userId, [...calendarRows, ...contactRows]);
  await markGoogleSynced(userId);
  return { ok: true, ...result };
}

// Daily cron entry: sync every connected account.
export async function syncAllGoogle(): Promise<{ accounts: number; created: number; datesAdded: number }> {
  const users = await usersWithGoogle();
  let created = 0;
  let datesAdded = 0;
  for (const u of users) {
    const r = await syncGoogleForUser(u.id, u.googleRefreshToken);
    created += r.created;
    datesAdded += r.datesAdded;
  }
  return { accounts: users.length, created, datesAdded };
}
