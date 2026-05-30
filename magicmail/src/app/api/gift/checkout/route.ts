import { NextResponse } from "next/server";
import { createGuestOrder } from "@/lib/db";
import { getProduct } from "@/lib/catalog";
import { stripe, billingIsLive, appUrl } from "@/lib/stripe";
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
  };

  // Demo mode: no Stripe keys → place the order now.
  if (!billingIsLive || !stripe) {
    await createGuestOrder(order);
    return NextResponse.json({ demo: true, redirect: "/gift/success?demo=1" });
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
    ],
    success_url: appUrl("/gift/success?status=success"),
    cancel_url: appUrl("/gift?status=cancelled"),
    metadata: { kind: "gift", ...order },
  });

  return NextResponse.json({ url: session.url });
}
