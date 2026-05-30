import "server-only";
import { appUrl } from "./urls";

// Personalized Santa video generation via Sentinel (the team's other app, which
// has a Pixar-style video builder). Provider-agnostic adapter, same pattern as
// the handwriting/AI layers:
//   - Live: SENTINEL_API_KEY set → request a video; Sentinel calls our webhook
//     when it's ready (/api/webhooks/sentinel).
//   - Offline: returns "requested"; the magic page shows a friendly
//     "Santa is recording your video" state until a URL arrives.
const apiKey = process.env.SENTINEL_API_KEY;
const apiUrl = process.env.SENTINEL_API_URL || "https://api.sentinel.app/v1";

export const videoIsLive = Boolean(apiKey);

export interface SantaVideoInput {
  token: string; // our magicToken — used to correlate the webhook callback
  childName: string;
  script: string; // the letter text / talking points
  style?: string; // default "pixar"
}

export interface SantaVideoResult {
  status: "requested" | "ready" | "failed";
  url?: string;
  jobId?: string;
}

export async function requestSantaVideo(input: SantaVideoInput): Promise<SantaVideoResult> {
  if (!apiKey) return { status: "requested" };
  try {
    const res = await fetch(`${apiUrl}/videos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        external_id: input.token,
        style: input.style ?? "pixar",
        character: "santa",
        title: `A message for ${input.childName}`,
        script: input.script,
        callback_url: appUrl("/api/webhooks/sentinel"),
      }),
    });
    if (!res.ok) return { status: "failed" };
    const data = await res.json().catch(() => ({}));
    if (data?.url || data?.video_url) return { status: "ready", url: data.url ?? data.video_url };
    return { status: "requested", jobId: data?.id ?? data?.job_id };
  } catch {
    return { status: "failed" };
  }
}
