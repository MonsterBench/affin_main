import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { generateNote } from "@/lib/ai";
import { getProduct } from "@/lib/catalog";
import { OCCASION_LABELS, type OccasionType } from "@/lib/types";

// Generates an AI handwritten-style note for a given occasion + gift.
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const occasion = String(body?.occasion ?? "just_because") as OccasionType;
  if (!Object.keys(OCCASION_LABELS).includes(occasion)) {
    return NextResponse.json({ error: "unknown occasion" }, { status: 400 });
  }
  const firstName = String(body?.firstName ?? "").trim() || "friend";

  const { note, live } = await generateNote({
    occasion,
    firstName,
    giftName: body?.giftId ? getProduct(String(body.giftId))?.name : undefined,
    senderName: body?.senderName ? String(body.senderName) : undefined,
    details: body?.details ? String(body.details) : undefined,
  });

  return NextResponse.json({ note, live });
}
