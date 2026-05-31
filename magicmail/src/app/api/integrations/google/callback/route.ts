import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { exchangeCode, emailFromIdToken } from "@/lib/google";
import { setGoogleTokens } from "@/lib/db";
import { syncGoogleForUser } from "@/lib/googleSync";
import { appUrl } from "@/lib/urls";

// Google redirects here after consent. We verify the session, exchange the code,
// store the refresh token, and run a first sync — then bounce back to the
// Integrations page with a status.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const sessionUserId = await requireUserId();

  // state must match the logged-in user (CSRF protection).
  if (!sessionUserId || !code || state !== sessionUserId) {
    return NextResponse.redirect(appUrl("/dashboard/integrations?google=error"));
  }

  const tokens = await exchangeCode(code);
  if (!tokens?.refresh_token) {
    return NextResponse.redirect(appUrl("/dashboard/integrations?google=error"));
  }

  await setGoogleTokens(sessionUserId, tokens.refresh_token, emailFromIdToken(tokens.id_token));
  await syncGoogleForUser(sessionUserId, tokens.refresh_token);

  return NextResponse.redirect(appUrl("/dashboard/integrations?google=connected"));
}
