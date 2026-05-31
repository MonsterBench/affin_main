import { NextResponse } from "next/server";
import { createGuestOrder } from "@/lib/db";
import { getProduct } from "@/lib/catalog";
import { stripe, billingIsLive, appUrl } from "@/lib/stripe";
import { resolveSantaAddons } from "@/lib/santaAddons";
import { sendEmail, brandedEmail, escapeHtml } from "@/lib/email";
import { currency } from "@/lib/format";
import { OCCASION_LABELS, type OccasionType } from "@/lib/types";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// One-off consumer gift checkout (no login). Live Stripe → Checkout (payment);
// demo mode → create the order immediately so the flow is clickable.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const product = getProduct(String(b?.giftId ?? ""));
  const occasion = String(b?.occasion ?? "just_because") as OccasionType;

  if (!product) return NextResponse.json({ error: "Pick a gift" }, { status: 400 });
  if (!Object.keys(OCCASION_LABELS).includes(occasion)) {
    return NextResponse.json({ error: "Pick an occasion" }, { status: 400 });
  }
  if (!b?.firstName || !b?.lastName) return NextResponse.json({ error: "Recipient name is required" }, { status: 400 });
  if (!b?.address1 || !b?.city || !b?.state || !b?.zip) {
    return NextResponse.json({ error: "A full mailing address is required" }, { status: 400 });
  }
  if (!emailRe.test(String(b?.buyerEmail ?? ""))) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  // Validated server-side so add-on prices can't be tampered with by the client.
  const addons = resolveSantaAddons(b?.addonIds);

  const order = {
    buyerEmail: String(b.buyerEmail),
    giftId: product.id,
    occasion,
    firstName: String(b.firstName),
    lastName: String(b.lastName),
    address1: String(b.address1),
    address2: b.address2 ? String(b.address2) : "",
    city: String(b.city),
    state: String(b.state),
    zip: String(b.zip),
    country: b.country ? String(b.country) : "US",
    // Cap to Stripe's 500-char metadata limit (live mode passes this via metadata).
    note: String(b.note ?? "").slice(0, 500),
    styleId: b.styleId ? String(b.styleId) : "",
    // Comma-joined labels for fulfillment; safe as a single metadata string.
    addons: addons.map((a) => a.label).join(", "),
  };

  const total = product.price + addons.reduce((sum, a) => sum + a.price, 0);

  // Demo mode: no Stripe keys → place the order now and send the receipt
  // ourselves. (In live mode Stripe emails its own receipt on payment.)
  if (!billingIsLive || !stripe) {
    const { magicToken } = await createGuestOrder(order);
    await sendGiftReceipt({ order, product, addons, total, magicToken });
    return NextResponse.json({ demo: true, redirect: `/gift/success?token=${magicToken}` });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: order.buyerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: { name: `${product.name} — for ${order.firstName} ${order.lastName}` },
        },
      },
      ...addons.map((a) => ({
        quantity: 1,
        price_data: {
          currency: "usd" as const,
          unit_amount: Math.round(a.price * 100),
          product_data: { name: `${a.emoji} ${a.label}` },
        },
      })),
    ],
    success_url: appUrl("/gift/success?status=success"),
    cancel_url: appUrl("/gift?status=cancelled"),
    metadata: { kind: "gift", ...order },
  });

  return NextResponse.json({ url: session.url });
}

// Builds and sends a branded order receipt. Falls back to a dev-console log
// when no email provider is configured, so the flow stays clickable.
async function sendGiftReceipt({
  order,
  product,
  addons,
  total,
  magicToken,
}: {
  order: { buyerEmail: string; firstName: string; lastName: string };
  product: { name: string; price: number };
  addons: { label: string; emoji: string; price: number }[];
  total: number;
  magicToken: string;
}) {
  const row = (label: string, amount: number) =>
    `<tr><td style="padding:4px 0">${escapeHtml(label)}</td><td style="padding:4px 0;text-align:right">${currency(amount)}</td></tr>`;
  const lines = [
    row(product.name, product.price),
    ...addons.map((a) => row(`${a.emoji} ${a.label}`, a.price)),
  ].join("");

  const body = `
    Thanks for sending a little magic to <strong>${escapeHtml(order.firstName)} ${escapeHtml(order.lastName)}</strong>!
    We&rsquo;re hand-penning the letter in real ink and getting it in the mail within 2&ndash;3 business days.
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;color:#2c6b45">
      ${lines}
      <tr><td style="padding:8px 0 0;border-top:1px solid #e3ddd0;font-weight:600">Total</td>
          <td style="padding:8px 0 0;border-top:1px solid #e3ddd0;text-align:right;font-weight:600">${currency(total)}</td></tr>
    </table>
    Your letter includes a secret QR code that unlocks a magic keepsake page.`;

  await sendEmail({
    to: order.buyerEmail,
    subject: `🎅 Your order is confirmed — a letter for ${order.firstName} is on its way`,
    html: brandedEmail("Your magic is on its way!", body, {
      label: "Preview the magic page",
      url: appUrl(`/magic/${magicToken}`),
    }),
  });
}
