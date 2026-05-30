import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, billingIsLive, appUrl } from "@/lib/stripe";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Demo mode: simulate "manage" by downgrading to free.
  if (!billingIsLive || !stripe) {
    await prisma.user.update({ where: { id: user.id }, data: { plan: "free" } });
    return NextResponse.json({ demo: true, plan: "free" });
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account yet" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: appUrl("/dashboard/billing"),
  });
  return NextResponse.json({ url: session.url });
}
