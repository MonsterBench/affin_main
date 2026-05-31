// Parsers for bulk-importing recipients & their important dates from a CSV
// spreadsheet or an .ics calendar. Pure, dependency-free, and tolerant of messy
// real-world input. Server and edge safe.

import type { OccasionType } from "./types";

export interface ParsedRecipient {
  firstName: string;
  lastName: string;
  email?: string;
  company?: string;
  city?: string;
  state?: string;
  zip?: string;
  address1?: string;
  importantDates: { occasion: OccasionType; date: string; label?: string }[];
}

// --- shared helpers --------------------------------------------------------

// Normalize many date shapes to ISO yyyy-mm-dd. Returns "" if unparseable.
// If no year is present (common for birthdays), we use 2000 as a placeholder —
// occasions are matched by month/day, so the year is cosmetic.
export function toIsoDate(raw: string): string {
  const s = (raw || "").trim();
  if (!s) return "";
  // Already ISO-ish.
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  // ICS basic: yyyymmdd.
  m = s.match(/^(\d{4})(\d{2})(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  // US m/d/yyyy or m/d (no year).
  m = s.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
  if (m) {
    const month = m[1].padStart(2, "0");
    const day = m[2].padStart(2, "0");
    let year = m[3] ?? "2000";
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month}-${day}`;
  }
  // Fallback to Date parsing (e.g. "June 12, 2018").
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return "";
}

function classifyOccasion(text: string): OccasionType {
  const t = text.toLowerCase();
  if (t.includes("anniversar")) return t.includes("work") ? "work_anniversary" : "milestone";
  if (t.includes("christmas") || t.includes("holiday") || t.includes("santa")) return "holiday";
  if (t.includes("clos")) return "closing";
  return "birthday";
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

// --- CSV -------------------------------------------------------------------

// Minimal RFC-4180-ish CSV parser (handles quotes and embedded commas/newlines).
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* ignore */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function header(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

// Maps a header row to known fields, then builds recipients.
export function recipientsFromCsv(text: string): { recipients: ParsedRecipient[]; skipped: number } {
  const rows = parseCsv(text);
  if (rows.length === 0) return { recipients: [], skipped: 0 };

  const cols = rows[0].map(header);
  const find = (...names: string[]) => cols.findIndex((c) => names.includes(c));

  const iFirst = find("firstname", "first", "fname");
  const iLast = find("lastname", "last", "lname");
  const iName = find("name", "fullname");
  const iEmail = find("email", "emailaddress");
  const iCompany = find("company", "organization", "organisation");
  const iCity = find("city");
  const iState = find("state", "province");
  const iZip = find("zip", "zipcode", "postalcode", "postcode");
  const iAddr = find("address", "address1", "street");
  const iBday = find("birthday", "birthdate", "dob", "dateofbirth", "bday");
  const iAnniv = find("anniversary");

  const recipients: ParsedRecipient[] = [];
  let skipped = 0;

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const get = (i: number) => (i >= 0 ? (cells[i] ?? "").trim() : "");

    let firstName = get(iFirst);
    let lastName = get(iLast);
    if (!firstName && iName >= 0) {
      const sp = splitName(get(iName));
      firstName = sp.firstName;
      lastName = sp.lastName;
    }
    if (!firstName) { skipped++; continue; }

    const dates: ParsedRecipient["importantDates"] = [];
    const bday = toIsoDate(get(iBday));
    if (bday) dates.push({ occasion: "birthday", date: bday });
    const anniv = toIsoDate(get(iAnniv));
    if (anniv) dates.push({ occasion: "milestone", date: anniv, label: "Anniversary" });

    recipients.push({
      firstName,
      lastName,
      email: get(iEmail) || undefined,
      company: get(iCompany) || undefined,
      city: get(iCity) || undefined,
      state: get(iState) || undefined,
      zip: get(iZip) || undefined,
      address1: get(iAddr) || undefined,
      importantDates: dates,
    });
  }
  return { recipients, skipped };
}

// --- ICS -------------------------------------------------------------------

// Unfolds RFC-5545 line folding (continuation lines start with a space/tab).
function unfold(text: string): string[] {
  const raw = text.split(/\r?\n/);
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else out.push(line);
  }
  return out;
}

// Pulls birthday/anniversary-type events out of an .ics calendar. We only keep
// dated events whose summary looks like a recurring personal occasion, and use
// the summary to name the person ("Emma's Birthday" -> Emma).
export function recipientsFromIcs(text: string): { recipients: ParsedRecipient[]; skipped: number } {
  const lines = unfold(text);
  const recipients: ParsedRecipient[] = [];
  let skipped = 0;

  let summary = "";
  let dtstart = "";
  let inEvent = false;

  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) { inEvent = true; summary = ""; dtstart = ""; continue; }
    if (line.startsWith("END:VEVENT")) {
      inEvent = false;
      const rec = recipientFromIcsEvent(summary, dtstart);
      if (rec) recipients.push(rec);
      else if (summary) skipped++;
      continue;
    }
    if (!inEvent) continue;
    if (line.startsWith("SUMMARY")) summary = line.slice(line.indexOf(":") + 1).trim();
    else if (line.startsWith("DTSTART")) dtstart = line.slice(line.indexOf(":") + 1).trim();
  }
  return { recipients, skipped };
}

function recipientFromIcsEvent(summary: string, dtstart: string): ParsedRecipient | null {
  if (!summary) return null;
  const s = summary.toLowerCase();
  const isPersonal = s.includes("birthday") || s.includes("anniversar") || s.includes("'s ");
  if (!isPersonal) return null;
  const date = toIsoDate(dtstart);
  if (!date) return null;

  // Extract the person's name: "Emma's Birthday", "Birthday - Emma", "Emma Birthday".
  let nameText = summary
    .replace(/['’]s\b/gi, "")
    .replace(/\b(birthday|bday|anniversary|anniv)\b/gi, "")
    .replace(/[-–—:]/g, " ")
    .trim();
  if (!nameText) nameText = summary.trim();

  const { firstName, lastName } = splitName(nameText);
  if (!firstName) return null;

  const occasion = classifyOccasion(summary);
  return {
    firstName,
    lastName,
    importantDates: [{ occasion, date, label: occasion === "birthday" ? undefined : summary }],
  };
}
