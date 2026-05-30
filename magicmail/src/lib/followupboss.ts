import "server-only";
import type { OccasionType } from "./types";

// Follow Up Boss (real-estate CRM) connector.
//
// FUB webhooks deliver an event name + resource URI; you fetch the full record
// from the FUB API using the account's API key (HTTP Basic, key as username).
// We map common FUB events to Kringle occasions and extract contact details.

const FUB_BASE = "https://api.followupboss.com/v1";

export function mapFubEvent(event: string, stage?: string): OccasionType | null {
  const e = event.toLowerCase();
  const s = (stage ?? "").toLowerCase();
  if (e.includes("deal") && (s.includes("clos") || s.includes("won") || s.includes("sold"))) return "closing";
  if (e === "peoplecreated" || e.includes("leadcreated")) return "new_client";
  if (e.includes("birthday")) return "birthday";
  return null;
}

export interface FubContact {
  firstName: string;
  lastName: string;
  email?: string;
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  stage?: string;
}

interface FubPerson {
  firstName?: string;
  lastName?: string;
  stage?: string;
  emails?: { value?: string }[];
  addresses?: { street?: string; city?: string; state?: string; code?: string }[];
}

export async function fetchFubResource(uri: string, apiKey: string): Promise<FubContact | null> {
  // Only allow fetching from the FUB API host.
  if (!uri.startsWith(FUB_BASE)) return null;
  try {
    const res = await fetch(uri, {
      headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}` },
    });
    if (!res.ok) return null;
    const p = (await res.json()) as FubPerson;
    const addr = p.addresses?.[0];
    return {
      firstName: p.firstName ?? "",
      lastName: p.lastName ?? "",
      email: p.emails?.[0]?.value,
      address1: addr?.street,
      city: addr?.city,
      state: addr?.state,
      zip: addr?.code,
      stage: p.stage,
    };
  } catch {
    return null;
  }
}
