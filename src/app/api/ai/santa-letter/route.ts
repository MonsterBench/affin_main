import { NextResponse } from "next/server";
import { generateSantaLetter } from "@/lib/ai";

// Public endpoint for the Santa letter creator (no login). Generates a
// personalized letter from Santa and returns the humanness check so the UI can
// show "sounds like a real letter from Santa".
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const childName = String(b?.childName ?? "").trim();
  if (!childName) return NextResponse.json({ error: "A child's name is required." }, { status: 400 });

  const result = await generateSantaLetter({
    childName,
    age: b?.age ? String(b.age) : undefined,
    hometown: b?.hometown ? String(b.hometown) : undefined,
    interests: b?.interests ? String(b.interests) : undefined,
    goodDeed: b?.goodDeed ? String(b.goodDeed) : undefined,
    wishItem: b?.wishItem ? String(b.wishItem) : undefined,
    petName: b?.petName ? String(b.petName) : undefined,
    sibling: b?.sibling ? String(b.sibling) : undefined,
  });

  return NextResponse.json({
    letter: result.letter,
    live: result.live,
    score: result.check.score,
    soundsHuman: result.check.soundsHuman,
    flags: result.check.flags,
  });
}
