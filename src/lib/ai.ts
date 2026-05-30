import "server-only";
import { OCCASION_LABELS, type OccasionType } from "./types";

// AI note writer. Generates a short, warm, handwritten-style note tailored to
// the occasion/theme. Uses Claude when ANTHROPIC_API_KEY is set; otherwise a
// themed template keeps the feature fully working offline.
const apiKey = process.env.ANTHROPIC_API_KEY;
export const aiIsLive = Boolean(apiKey);

export interface NoteRequest {
  occasion: OccasionType;
  firstName: string;
  giftName?: string;
  senderName?: string;
  details?: string; // extra context (e.g. "loves dinosaurs", "412 Maple St")
}

const SANTA_VOICE: Partial<Record<OccasionType, boolean>> = { holiday: true };

export async function generateNote(req: NoteRequest): Promise<{ note: string; live: boolean }> {
  if (apiKey) {
    try {
      const note = await callClaude(req, apiKey);
      if (note) return { note, live: true };
    } catch (err) {
      console.error("[ai] generation failed, using fallback", err);
    }
  }
  return { note: templateNote(req), live: false };
}

async function callClaude(req: NoteRequest, key: string): Promise<string> {
  const santa = SANTA_VOICE[req.occasion];
  const system = santa
    ? "You are Santa Claus writing a warm, magical, personal letter to a child. Keep it under 90 words, joyful and believable, mentioning the North Pole. Output only the letter text."
    : "You write short, warm, sincere handwritten notes for a premium gifting brand. 2-4 sentences, under 70 words, natural and personal — never corporate or salesy. Output only the note text.";

  const userMsg = [
    `Occasion: ${OCCASION_LABELS[req.occasion]}`,
    `Recipient first name: ${req.firstName}`,
    req.giftName ? `Gift being sent: ${req.giftName}` : "",
    req.senderName ? `From: ${req.senderName}` : "",
    req.details ? `Context: ${req.details}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}`);
  const data = await res.json();
  return (data?.content?.[0]?.text ?? "").trim();
}

function templateNote(req: NoteRequest): string {
  const n = req.firstName;
  switch (req.occasion) {
    case "holiday":
      return `Dear ${n},\n\nIt's me — Santa! All the way up at the North Pole, the elves and I have been keeping an eye out, and you're right at the top of the Nice List. Keep being kind and curious. A little magic is on its way to you.\n\nWith Christmas cheer,\nSanta 🎅`;
    case "birthday":
      return `Happy birthday, ${n}! 🎉 Wishing you a day as wonderful as you are, full of laughter and the people you love. Here's to a fantastic year ahead.`;
    case "closing":
      return `Congratulations on your new home, ${n}! 🏡 It was such a joy to be part of this milestone with you. Wishing you many happy memories in your new space — here's a little something to celebrate.`;
    case "work_anniversary":
      return `${n}, congratulations on another incredible year! Your dedication doesn't go unnoticed, and we're so grateful to have you on the team. Here's to many more.`;
    case "new_client":
      return `Welcome aboard, ${n}! We're thrilled to be working together and can't wait to do great things. Here's a small token to kick things off on the right foot.`;
    case "milestone":
      return `${n}, what an achievement! 🏆 Moments like this deserve to be celebrated. Thank you for letting us be part of the journey — onward and upward.`;
    case "thank_you":
      return `Thank you so much, ${n}. It truly meant a lot, and we wanted to send a little something to say so. Looking forward to staying in touch.`;
    default:
      return `Thinking of you, ${n}! Just a little something to brighten your day and let you know you matter.`;
  }
}
