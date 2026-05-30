import "server-only";
import Stripe from "stripe";

export { appUrl } from "./urls";

// Billing runs in one of two modes:
//  - Live:  STRIPE_SECRET_KEY is set → real Checkout & Customer Portal.
//  - Demo:  key absent → upgrades are simulated locally so the flow is clickable.
const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;
export const billingIsLive = Boolean(stripe);
