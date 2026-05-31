import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, billingIsLive, appUrl } from "@/lib/stripe";
import { getPlan } from "@/lib/plans";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { plan: planId } = await req.json().catch(() => ({ plan: "" }));
  const plan = getPlan(String(planId));

  // Demo mode: no Stripe keys → just flip the plan so the flow is fully clickable.
  if (!billingIsLive || !stripe) {
    await prisma.user.update({ where: { id: user.id }, data: { plan: plan.id } });
    return NextResponse.json({ demo: true, plan: plan.id });
  }

  if (plan.id === "free") {
    await prisma.user.update({ where: { id: user.id }, data: { plan: "free" } });
    return NextResponse.json({ plan: "free" });
  }

  const priceId = plan.priceEnv ? process.env[plan.priceEnv] : undefined;
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured for this plan" }, { status: 400 });
  }

  // Ensure a Stripe customer exists for this account.
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: appUrl("/dashboard/billing?status=success"),
    cancel_url: appUrl("/dashboard/billing?status=cancelled"),
    metadata: { userId: user.id, plan: plan.id },
    subscription_data: { metadata: { userId: user.id, plan: plan.id } },
  });

  return NextResponse.json({ url: session.url });
}
