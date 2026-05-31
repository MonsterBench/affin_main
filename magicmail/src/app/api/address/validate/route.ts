import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { validateAddress } from "@/lib/address";

// Inline address check for the recipient/compose forms.
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const result = await validateAddress({
    address1: String(b?.address1 ?? ""),
    address2: b?.address2 ? String(b.address2) : undefined,
    city: String(b?.city ?? ""),
    state: String(b?.state ?? ""),
    zip: String(b?.zip ?? ""),
    country: b?.country ? String(b.country) : "US",
  });
  return NextResponse.json(result);
}
