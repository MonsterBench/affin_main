import "server-only";

// Handwriting / auto-pen integration layer.
//
// The bridge between an AI-written note and a physical handwriting device or
// service. Provider-agnostic — pick an adapter via HANDWRITING_PROVIDER:
//
//  - "handwrytten": Handwrytten's REST API writes & mails notes in real ink with
//     robotic pens (https://www.handwrytten.com/handwritten-notes-api). Fastest
//     path — no hardware to buy. Configure HANDWRYTTEN_API_KEY (+ optional
//     HANDWRYTTEN_API_URL / HANDWRYTTEN_CARD_ID / HANDWRYTTEN_FONT_ID).
//  - "axidraw":     In-house AxiDraw / iDraw pen plotters. A local agent polls the
//     queue and drives the machine via its CLI/SDK.
//  - "manual":      Default — queues jobs for an operator to run on the machine.

export type HandwritingProvider = "handwrytten" | "axidraw" | "manual";

export interface MailingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface HandwritingJob {
  sendId: string;
  recipientName: string;
  address: string; // formatted, for operator display
  recipient?: MailingAddress; // structured, for provider APIs
  note: string;
  style?: string; // pen / handwriting style id
}

export interface HandwritingResult {
  jobId: string;
  provider: HandwritingProvider;
  status: "queued" | "submitted" | "failed";
  message: string;
}

export function activeProvider(): HandwritingProvider {
  const p = process.env.HANDWRITING_PROVIDER as HandwritingProvider | undefined;
  if (p === "handwrytten" && process.env.HANDWRYTTEN_API_KEY) return "handwrytten";
  if (p === "axidraw") return "axidraw";
  return "manual";
}

export async function submitHandwriting(job: HandwritingJob): Promise<HandwritingResult> {
  const provider = activeProvider();
  const jobId = `hw_${job.sendId}_${Date.now().toString(36)}`;

  if (provider === "handwrytten") return submitToHandwrytten(job, jobId);
  if (provider === "axidraw") {
    return { jobId, provider, status: "queued", message: "Queued for the in-house AxiDraw pen plotter." };
  }
  return { jobId, provider, status: "queued", message: "Queued for the operator to run on the auto-pen machine." };
}

// Live Handwrytten submission. Field names follow their order API; the exact
// schema can vary by account, so the base URL, card, and font are env-driven and
// errors are handled gracefully (we never crash a send).
async function submitToHandwrytten(job: HandwritingJob, jobId: string): Promise<HandwritingResult> {
  const key = process.env.HANDWRYTTEN_API_KEY!;
  const base = process.env.HANDWRYTTEN_API_URL || "https://api.handwrytten.com/v1";
  const r = job.recipient;
  if (!r) {
    return { jobId, provider: "handwrytten", status: "failed", message: "Missing structured address." };
  }

  try {
    const res = await fetch(`${base}/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        card_id: process.env.HANDWRYTTEN_CARD_ID,
        font_id: process.env.HANDWRYTTEN_FONT_ID,
        message: job.note,
        recipient: {
          name: r.name,
          address1: r.address1,
          address2: r.address2 ?? "",
          city: r.city,
          state: r.state,
          zip: r.zip,
          country: r.country || "US",
        },
      }),
    });
    if (!res.ok) {
      return { jobId, provider: "handwrytten", status: "failed", message: `Handwrytten error ${res.status}.` };
    }
    const data = await res.json().catch(() => ({}));
    const orderId = data?.order_id ?? data?.id ?? jobId;
    return {
      jobId: String(orderId),
      provider: "handwrytten",
      status: "submitted",
      message: "Submitted to Handwrytten for robotic handwriting & mailing.",
    };
  } catch {
    return { jobId, provider: "handwrytten", status: "failed", message: "Could not reach Handwrytten." };
  }
}
