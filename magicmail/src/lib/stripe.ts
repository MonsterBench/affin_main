import "server-only";
import Stripe from "stripe";

// Billing runs in one of two modes:
//  - Live:  STRIPE_SECRET_KEY is set → real Checkout & Customer Portal.
//  - Demo:  key absent → upgrades are simulated locally so the flow is clickable.
const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;
export const billingIsLive = Boolean(stripe);

export function appUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}${path}`;
}
