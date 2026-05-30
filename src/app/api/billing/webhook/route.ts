import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { createGuestOrder } from "@/lib/db";
import type { OccasionType } from "@/lib/types";

// Stripe webhook: keeps each user's plan in sync with their subscription.
export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ received: true, demo: true });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = secret && sig
      ? stripe.webhooks.constructEvent(body, sig, secret)
      : (JSON.parse(body) as Stripe.Event);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  async function setPlan(userId: string | undefined, plan: string | undefined, subId?: string) {
    if (!userId) return;
    await prisma.user.update({
      where: { id: userId },
      data: { plan: plan ?? "pro", ...(subId ? { stripeSubscriptionId: subId } : {}) },
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const m = s.metadata ?? {};
      if (m.kind === "gift") {
        // One-off consumer gift paid → create the order.
        await createGuestOrder({
          buyerEmail: m.buyerEmail ?? s.customer_email ?? "",
          giftId: m.giftId ?? "",
          occasion: (m.occasion ?? "just_because") as OccasionType,
          firstName: m.firstName ?? "",
          lastName: m.lastName ?? "",
          address1: m.address1 ?? "",
          address2: m.address2 ?? "",
          city: m.city ?? "",
          state: m.state ?? "",
          zip: m.zip ?? "",
          country: m.country ?? "US",
          note: m.note ?? "",
        });
      } else {
        await setPlan(m.userId, m.plan, s.subscription as string | undefined);
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await setPlan(sub.metadata?.userId, sub.metadata?.plan, sub.id);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await setPlan(sub.metadata?.userId, "free");
      break;
    }
  }

  return NextResponse.json({ received: true });
}
