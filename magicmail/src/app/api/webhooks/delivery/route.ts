import { NextResponse } from "next/server";
import { updateDeliveryStatus, userIdForApiKey } from "@/lib/db";
import { sendEmail, brandedEmail } from "@/lib/email";
import { appUrl } from "@/lib/urls";
import { STATUS_LABELS, type SendStatus } from "@/lib/types";

// Inbound delivery/tracking callback from the handwriting or shipping provider.
//
// Auth: Bearer DELIVERY_WEBHOOK_SECRET (global), or x-api-key = an account key.
// Body: { "sendId": "...", "status": "shipped" | "delivered", "trackingNumber": "..." }
const ALLOWED: SendStatus[] = ["assembling", "shipped", "delivered"];

export async function POST(req: Request) {
  const secret = process.env.DELIVERY_WEBHOOK_SECRET;
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const apiKey = req.headers.get("x-api-key") ?? "";

  const authorized =
    (secret && bearer === secret) || (await userIdForApiKey(apiKey)) !== null;
  if (!authorized) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const sendId = String(body?.sendId ?? "");
  const status = String(body?.status ?? "") as SendStatus;
  if (!sendId) return NextResponse.json({ error: "sendId is required" }, { status: 400 });
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: `status must be one of: ${ALLOWED.join(", ")}` }, { status: 400 });
  }

  const result = await updateDeliveryStatus(sendId, status, body?.trackingNumber ? String(body.trackingNumber) : undefined);
  if (!result.ok) return NextResponse.json({ error: "send not found" }, { status: 404 });

  // Notify the owner when a gift lands.
  if (status === "delivered" && result.ownerEmail) {
    await sendEmail({
      to: result.ownerEmail,
      subject: `Delivered: your gift for ${result.recipientName} 🎉`,
      html: brandedEmail(
        "Delivered! 🎉",
        `Your gift for <b>${result.recipientName}</b> was just delivered. A little magic, on its way to making someone's day.`,
        { label: "View in dashboard", url: appUrl("/dashboard/sends") },
      ),
    });
  }

  return NextResponse.json({ ok: true, status: STATUS_LABELS[status] });
}
