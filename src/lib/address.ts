import "server-only";

// Mailing-address validation.
//
// Always runs deterministic FORMAT checks (required fields, US ZIP/state shape).
// If Smarty credentials are present (SMARTY_AUTH_ID + SMARTY_AUTH_TOKEN), it also
// performs live deliverability VERIFICATION and returns the normalized address.
// Without keys it degrades cleanly to format-only.

export interface AddressInput {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export type AddressLevel = "verified" | "format" | "invalid";

export interface AddressResult {
  ok: boolean; // safe to mail (format passed; verification didn't fail)
  level: AddressLevel;
  issues: string[];
  normalized?: AddressInput;
}

const US_ZIP = /^\d{5}(-\d{4})?$/;
const US_STATE = /^[A-Za-z]{2}$/;

export function checkFormat(a: AddressInput): string[] {
  const issues: string[] = [];
  const country = (a.country || "US").toUpperCase();
  if (!a.address1?.trim()) issues.push("Street address is required.");
  if (!a.city?.trim()) issues.push("City is required.");
  if (country === "US" || country === "USA") {
    if (!US_STATE.test(a.state ?? "")) issues.push("State must be a 2-letter code (e.g. NC).");
    if (!US_ZIP.test(a.zip ?? "")) issues.push("ZIP must be 5 digits (or ZIP+4).");
  } else if (!a.zip?.trim()) {
    issues.push("Postal code is required.");
  }
  return issues;
}

export const addressVerificationLive = Boolean(
  process.env.SMARTY_AUTH_ID && process.env.SMARTY_AUTH_TOKEN,
);

export async function validateAddress(a: AddressInput): Promise<AddressResult> {
  const issues = checkFormat(a);
  if (issues.length) return { ok: false, level: "invalid", issues };

  if (!addressVerificationLive) return { ok: true, level: "format", issues: [] };

  // Live verification via Smarty US Street Address API.
  try {
    const url = new URL("https://us-street.api.smarty.com/street-address");
    url.searchParams.set("auth-id", process.env.SMARTY_AUTH_ID!);
    url.searchParams.set("auth-token", process.env.SMARTY_AUTH_TOKEN!);
    url.searchParams.set("street", a.address1);
    if (a.address2) url.searchParams.set("secondary", a.address2);
    url.searchParams.set("city", a.city);
    url.searchParams.set("state", a.state);
    url.searchParams.set("zipcode", a.zip);
    url.searchParams.set("candidates", "1");

    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) return { ok: true, level: "format", issues: [] }; // provider down → don't block
    const candidates = (await res.json()) as Array<{
      delivery_line_1?: string;
      components?: { city_name?: string; state_abbreviation?: string; zipcode?: string; plus4_code?: string };
    }>;
    if (!candidates?.length) {
      return { ok: false, level: "invalid", issues: ["We couldn't verify this address — please double-check it."] };
    }
    const c = candidates[0];
    const zip = c.components?.zipcode + (c.components?.plus4_code ? `-${c.components.plus4_code}` : "");
    return {
      ok: true,
      level: "verified",
      issues: [],
      normalized: {
        address1: c.delivery_line_1 ?? a.address1,
        address2: a.address2,
        city: c.components?.city_name ?? a.city,
        state: c.components?.state_abbreviation ?? a.state,
        zip: zip || a.zip,
        country: "US",
      },
    };
  } catch {
    return { ok: true, level: "format", issues: [] }; // network error → don't block mailing
  }
}
