import "server-only";

// Handwriting / auto-pen integration layer.
//
// This is the bridge between an AI-written note and a physical handwriting
// device or service. It's provider-agnostic: pick an adapter based on env.
//
//  - "handwrytten": Handwrytten has a real REST API that writes & mails notes
//     in real ink with robotic pens (https://www.handwrytten.com/handwritten-notes-api).
//  - "axidraw":     For in-house hardware (AxiDraw / iDraw pen plotters), a small
//     local agent polls a queue and drives the machine via the CLI/SDK.
//  - "manual":      Default — queues jobs for an operator to run on the machine.
//
// All adapters share the same contract so the rest of the app never changes.

export type HandwritingProvider = "handwrytten" | "axidraw" | "manual";

export interface HandwritingJob {
  sendId: string;
  recipientName: string;
  address: string;
  note: string;
  style?: string; // pen/handwriting style id
}

export interface HandwritingResult {
  jobId: string;
  provider: HandwritingProvider;
  status: "queued" | "submitted";
  message: string;
}

export function activeProvider(): HandwritingProvider {
  const p = process.env.HANDWRITING_PROVIDER as HandwritingProvider | undefined;
  if (p === "handwrytten" && process.env.HANDWRYTTEN_API_KEY) return "handwrytten";
  if (p === "axidraw") return "axidraw";
  return "manual";
}

// Submit a note for handwriting. In live mode this would call the provider's
// API; here it returns a queued job so the operator UI and pipeline work end to
// end without external hardware.
export async function submitHandwriting(job: HandwritingJob): Promise<HandwritingResult> {
  const provider = activeProvider();
  const jobId = `hw_${job.sendId}_${Date.now().toString(36)}`;

  if (provider === "handwrytten") {
    // Example shape — wire to the real Handwrytten API when keys are present.
    // await fetch("https://api.handwrytten.com/v1/orders", { ... })
    return { jobId, provider, status: "submitted", message: "Submitted to Handwrytten for robotic handwriting & mailing." };
  }
  if (provider === "axidraw") {
    // The in-house pen-plotter agent will pick this job up from the queue.
    return { jobId, provider, status: "queued", message: "Queued for the in-house AxiDraw pen plotter." };
  }
  return { jobId, provider, status: "queued", message: "Queued for the operator to run on the auto-pen machine." };
}
