import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { importRecipients } from "@/lib/db";
import { recipientsFromCsv, recipientsFromIcs } from "@/lib/importer";

// Bulk import recipients + important dates from CSV, .ics text, or a calendar
// feed URL. Body: { kind: "csv" | "ics" | "url", content?: string, url?: string }
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const kind = String(b?.kind ?? "");

  let text = "";
  let parser: typeof recipientsFromCsv;

  if (kind === "csv") {
    text = String(b?.content ?? "");
    parser = recipientsFromCsv;
  } else if (kind === "ics") {
    text = String(b?.content ?? "");
    parser = recipientsFromIcs;
  } else if (kind === "url") {
    const url = String(b?.url ?? "");
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Enter a valid calendar URL." }, { status: 400 });
    }
    try {
      // webcal:// links are really https.
      const res = await fetch(url.replace(/^webcal:/i, "https:"));
      if (!res.ok) return NextResponse.json({ error: `Couldn't fetch the calendar (${res.status}).` }, { status: 400 });
      text = await res.text();
    } catch {
      return NextResponse.json({ error: "Couldn't reach that calendar URL." }, { status: 400 });
    }
    parser = recipientsFromIcs;
  } else {
    return NextResponse.json({ error: "Unknown import type." }, { status: 400 });
  }

  if (!text.trim()) return NextResponse.json({ error: "Nothing to import." }, { status: 400 });

  const { recipients, skipped } = parser(text);
  if (recipients.length === 0) {
    return NextResponse.json({ error: "No importable people found. Check the file's format.", skipped }, { status: 400 });
  }

  const result = await importRecipients(userId, recipients);
  return NextResponse.json({ ok: true, ...result, skipped, parsed: recipients.length });
}
