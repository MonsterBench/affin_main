// Subscription plans, shared by the marketing page, billing UI, and Stripe.
export type PlanId = "free" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // monthly USD
  blurb: string;
  features: string[];
  priceEnv?: string; // env var holding the Stripe Price ID
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Magic Mail Club",
    price: 0,
    blurb: "For families. Pay only for the gifts you send.",
    features: ["Santa letters & seasonal boxes", "Birthday & milestone reminders", "Handwritten notes", "Delivery tracking"],
  },
  {
    id: "pro",
    name: "Professional",
    price: 49,
    blurb: "For agents & small teams growing on referrals.",
    features: ["Up to 250 contacts", "Unlimited automations", "CRM import", "ROI dashboard", "White-label gifts"],
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_PRO",
  },
  {
    id: "business",
    name: "Business",
    price: 199,
    blurb: "For firms automating gifting at scale.",
    features: ["Unlimited contacts", "Team seats & roles", "API & Zapier", "Dedicated concierge", "Custom keepsakes"],
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_BUSINESS",
  },
];

export function getPlan(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
