import { NextResponse } from "next/server";
import { generateNote } from "@/lib/ai";
import { getProduct } from "@/lib/catalog";
import { OCCASION_LABELS, type OccasionType } from "@/lib/types";

// Public AI note generator for the consumer gift page (no login required).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const occasion = String(body?.occasion ?? "just_because") as OccasionType;
  if (!Object.keys(OCCASION_LABELS).includes(occasion)) {
    return NextResponse.json({ error: "unknown occasion" }, { status: 400 });
  }
  const { note, live } = await generateNote({
    occasion,
    firstName: String(body?.firstName ?? "").trim() || "friend",
    giftName: body?.giftId ? getProduct(String(body.giftId))?.name : undefined,
    senderName: body?.senderName ? String(body.senderName) : undefined,
  });
  return NextResponse.json({ note, live });
}
