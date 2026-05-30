import "server-only";
import { OCCASION_LABELS, type OccasionType } from "./types";
import { scoreHumanness, type HumannessResult } from "./humanizer";

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

// ---- Santa letters (the flagship) ----------------------------------------
export interface SantaInput {
  childName: string;
  age?: string;
  hometown?: string;
  interests?: string; // "dinosaurs and soccer"
  goodDeed?: string; // "helped your little brother learn to ride his bike"
  wishItem?: string; // "a telescope"
  petName?: string;
  sibling?: string; // sibling/friend name to greet
  extra?: string;
}

const SANTA_SYSTEM = `You ARE Santa Claus, writing a personal letter to one specific child. Write it so a parent reading it aloud would tear up and the child would fully believe it.

VOICE: warm, jolly, playful, encouraging. Simple words a 6-year-old understands. Start with "Ho ho ho!" and a Merry Christmas. Sound like a kind grandfather, never formal.

MAKE IT REAL & PERSONAL:
- Use the child's name 2-3 times naturally.
- Weave in the specific details you're given (what they love, a good thing they did, their pet, hometown, their wish). Mention a specific thing they did as if you watched all year.
- Bring the North Pole to life with ONE or two concrete touches (Mrs. Claus's cookies cooling in the kitchen, the elves wrapping in the workshop, a reindeer like Comet being silly in the barn).
- For the wish: be encouraging but never promise a specific gift.
- End with a cozy Christmas Eve tradition (leave cookies, off to bed, listen for sleigh bells) and sign off with Christmas magic.

LENGTH: 150-210 words.

CRITICAL — DO NOT SOUND LIKE AI. Never use these words: delve, realm, embark, tapestry, testament, navigate, unveil, illuminate, bustling, nestled, whimsical, heartwarming, multifaceted, myriad. Do NOT use more than ONE em dash. No "In a world where", no "not just X but Y" patterns, no fancy vocabulary. Vary your sentence lengths like a real person. Output ONLY the letter text, nothing else.`;

function santaUserMessage(i: SantaInput): string {
  return [
    `Child's name: ${i.childName}`,
    i.age ? `Age: ${i.age}` : "",
    i.hometown ? `Hometown: ${i.hometown}` : "",
    i.interests ? `Loves: ${i.interests}` : "",
    i.goodDeed ? `Something kind/good they did this year: ${i.goodDeed}` : "",
    i.wishItem ? `Hoping for: ${i.wishItem}` : "",
    i.petName ? `Pet: ${i.petName}` : "",
    i.sibling ? `Please greet their sibling/friend: ${i.sibling}` : "",
    i.extra ? `Extra: ${i.extra}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export interface SantaResult {
  letter: string;
  live: boolean;
  check: HumannessResult;
}

export async function generateSantaLetter(input: SantaInput): Promise<SantaResult> {
  if (apiKey) {
    try {
      let letter = await callClaudeRaw(SANTA_SYSTEM, santaUserMessage(input), apiKey, 600, "claude-sonnet-4-6");
      let check = scoreHumanness(letter);
      // One revise pass if it reads robotic.
      if (!check.soundsHuman) {
        const fix = `This letter sounds a bit like AI for these reasons: ${check.flags.join(" ")}. Rewrite it to sound completely human and like a real letter from Santa, fixing those issues. Keep all the personal details. Output only the letter.\n\nLETTER:\n${letter}`;
        const revised = await callClaudeRaw(SANTA_SYSTEM, fix, apiKey, 600, "claude-sonnet-4-6");
        const revisedCheck = scoreHumanness(revised);
        if (revisedCheck.score >= check.score) {
          letter = revised;
          check = revisedCheck;
        }
      }
      if (letter) return { letter, live: true, check };
    } catch (err) {
      console.error("[ai] santa generation failed, using template", err);
    }
  }
  const letter = santaTemplate(input);
  return { letter, live: false, check: scoreHumanness(letter) };
}

async function callClaudeRaw(
  system: string,
  user: string,
  key: string,
  maxTokens: number,
  model: string,
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}`);
  const data = await res.json();
  return (data?.content?.[0]?.text ?? "").trim();
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// A genuinely personal Santa letter built from the details — varied phrasing,
// no AI tells, passes the humanness checker. Used when no AI key is set.
function santaTemplate(i: SantaInput): string {
  const name = i.childName || "my friend";
  const parts: string[] = [];

  parts.push(pick([`Ho ho ho! Merry Christmas, ${name}!`, `Ho ho ho! Hello, ${name}!`, `Merry Christmas, dear ${name}!`]));

  const northPole = pick([
    "It is wonderfully cold up here at the North Pole today, and the elves are singing while they wrap the very last presents.",
    "Up here at the North Pole, Mrs. Claus just pulled a fresh tray of cookies from the oven, and the whole workshop smells like cinnamon.",
    "The reindeer are getting cozy in the barn, and Comet keeps trying to sneak an extra carrot before the big night.",
  ]);
  parts.push(northPole);

  if (i.goodDeed) {
    parts.push(pick([
      `I keep a special book about every child, and I wrote down the time you ${i.goodDeed}. That made me smile all the way up here, ${name}.`,
      `I have been watching all year, and I saw when you ${i.goodDeed}. A kind heart like that is the best kind of magic.`,
    ]));
  } else {
    parts.push(`I keep a special book about every child, and ${name}, your page is one of my favorites this year.`);
  }

  if (i.interests) {
    parts.push(pick([
      `A little elf told me you love ${i.interests}. I think that is just wonderful.`,
      `I hear you are quite the fan of ${i.interests}! Keep having fun with that.`,
    ]));
  }
  if (i.petName) parts.push(`Please give ${i.petName} a gentle pat from me. The reindeer would love a new friend.`);
  if (i.hometown) parts.push(`Flying my sleigh over ${i.hometown} is one of my favorite parts of Christmas Eve.`);
  if (i.wishItem) {
    parts.push(pick([
      `I saw that you have been hoping for ${i.wishItem}. I cannot make any promises, but keep being your kind self and watch closely on Christmas morning.`,
      `A little bird told me about ${i.wishItem} on your list. Keep being good, and we will see what magic the night brings!`,
    ]));
  }
  if (i.sibling) parts.push(`Give ${i.sibling} a great big hug from me, too.`);

  parts.push(pick([
    `On Christmas Eve, leave a couple of cookies by the tree, hop into bed early, and listen very closely for the jingle of sleigh bells.`,
    `Remember to set out some cookies, get to sleep nice and early on Christmas Eve, and keep your ears open for bells in the night sky.`,
  ]));
  parts.push(pick(["With love and Christmas magic,\nSanta 🎅", "Ho ho ho, and lots of love,\nSanta Claus 🎅"]));

  return parts.join("\n\n");
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
