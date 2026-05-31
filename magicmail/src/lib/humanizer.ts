// "Does this sound like AI?" checker.
//
// Deterministic detector for the well-documented tells of LLM writing (inflated
// vocabulary, em-dash overuse, formulaic openers, negative parallelism). Returns
// a 0-100 humanness score plus the specific flags, so we can warn the user and
// auto-revise a letter that reads robotic. No API needed — works offline.

const AI_WORDS = [
  "delve", "tapestry", "testament", "realm", "embark", "unveil", "illuminate",
  "unlock", "moreover", "furthermore", "leverage", "multifaceted", "myriad",
  "bustling", "nestled", "treasure trove", "whimsical", "heartwarming",
  "in conclusion", "navigating", "navigate the", "elevate", "foster a",
  "in the realm of", "a world of", "ever-evolving", "boundless", "kaleidoscope",
];

const CLICHE_OPENERS = [
  "i hope this letter finds you", "in a world where", "in today's", "in the age of",
  "without further ado", "little did", "as the seasons", "picture this",
];

// AI refusal / disclaimer tells — kept specific so natural phrases like
// "I cannot make any promises" don't false-positive.
const ROBOTIC_PHRASES = [
  "as an ai", "as a large language", "language model", "i cannot fulfill",
  "i cannot provide", "i cannot assist", "i'm unable to", "i am unable to",
  "i cannot generate", "i do not have personal", "as a helpful assistant",
];

export interface HumannessResult {
  score: number; // 0-100, higher = more human
  soundsHuman: boolean; // score >= 72
  flags: string[];
}

export function scoreHumanness(text: string): HumannessResult {
  const t = text.toLowerCase();
  const flags: string[] = [];
  let penalty = 0;

  // Dead giveaways.
  for (const p of ROBOTIC_PHRASES) {
    if (t.includes(p)) {
      penalty += 60;
      flags.push(`Contains a robotic phrase ("${p}").`);
    }
  }

  // Inflated AI vocabulary.
  const hits = AI_WORDS.filter((w) => t.includes(w));
  if (hits.length) {
    penalty += hits.length * 12;
    flags.push(`Uses AI-flavored words: ${hits.slice(0, 4).join(", ")}.`);
  }

  // Formulaic openers.
  for (const o of CLICHE_OPENERS) {
    if (t.includes(o)) {
      penalty += 18;
      flags.push(`Formulaic phrasing ("${o}…").`);
      break;
    }
  }

  // Em-dash overuse (LLMs sprinkle them; >2 reads machine-made).
  const emDashes = (text.match(/—/g) || []).length;
  if (emDashes > 2) {
    penalty += (emDashes - 2) * 8;
    flags.push(`Too many em dashes (${emDashes}).`);
  }

  // Negative parallelism: "It's not X, it's Y" / "not just … but".
  const negParallel = (t.match(/\bnot (just|only|merely)\b/g) || []).length;
  if (negParallel >= 2) {
    penalty += negParallel * 8;
    flags.push("Repeated “not just… but” construction.");
  }

  // Uniform, over-long sentences (low variation = machine cadence).
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length >= 4) {
    const lengths = sentences.map((s) => s.split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + (b - avg) ** 2, 0) / lengths.length;
    if (avg > 22 && variance < 12) {
      penalty += 12;
      flags.push("Sentences are long and uniform in length.");
    }
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  return { score, soundsHuman: score >= 72, flags };
}
