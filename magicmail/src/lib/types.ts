// Core domain model for the Kringle gifting platform.
// Kept framework-agnostic so it can later move behind a real database.

export type OccasionType =
  | "holiday" // Christmas / Santa letters — the flagship
  | "birthday"
  | "work_anniversary"
  | "closing" // real-estate deal closed
  | "new_client"
  | "milestone"
  | "thank_you"
  | "just_because";

export type AudienceKind = "client" | "employee" | "family" | "kid" | "prospect";

export type GiftCategory =
  | "letter" // handwritten Santa / occasion letters
  | "giftbox" // curated themed boxes
  | "treat" // food & drink
  | "keepsake"
  | "card";

export type GiftTier = "essential" | "signature" | "deluxe";

export interface GiftProduct {
  id: string;
  name: string;
  category: GiftCategory;
  tier: GiftTier;
  price: number; // USD, retail per send
  cost: number; // fulfillment cost (for margin math)
  emoji: string; // lightweight stand-in for product imagery
  blurb: string;
  occasions: OccasionType[];
  handwritten: boolean;
  popular?: boolean;
}

export interface ImportantDate {
  occasion: OccasionType;
  date: string; // ISO yyyy-mm-dd (year ignored for recurring)
  label?: string;
}

export interface Recipient {
  id: string;
  firstName: string;
  lastName: string;
  audience: AudienceKind;
  company?: string;
  email?: string;
  city: string;
  state: string;
  tags: string[];
  importantDates: ImportantDate[];
  notes?: string;
  createdAt: string;
}

export interface Automation {
  id: string;
  name: string;
  triggerOccasion: OccasionType;
  giftId: string;
  leadTimeDays: number; // how many days before the date we mail
  audienceFilter: AudienceKind | "all";
  tagFilter?: string; // optional tag the recipient must carry
  active: boolean;
  noteTemplate: string;
  createdAt: string;
}

export type SendStatus =
  | "scheduled"
  | "handwriting" // robotic auto-pen writing the note
  | "assembling"
  | "shipped"
  | "delivered";

export interface Send {
  id: string;
  recipientId: string;
  giftId: string;
  occasion: OccasionType;
  status: SendStatus;
  scheduledFor: string; // ISO date the gift mails
  deliveredOn?: string;
  trackingNumber?: string;
  note: string;
  automationId?: string; // null/undefined = sent manually
  createdAt: string;
}

export const OCCASION_LABELS: Record<OccasionType, string> = {
  holiday: "Holiday / Santa letter",
  birthday: "Birthday",
  work_anniversary: "Work anniversary",
  closing: "Closing",
  new_client: "New client",
  milestone: "Milestone",
  thank_you: "Thank you",
  just_because: "Just because",
};

export const AUDIENCE_LABELS: Record<AudienceKind, string> = {
  client: "Client",
  employee: "Employee",
  family: "Family",
  kid: "Child",
  prospect: "Prospect",
};

export const STATUS_LABELS: Record<SendStatus, string> = {
  scheduled: "Scheduled",
  handwriting: "Handwriting",
  assembling: "Assembling",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const STATUS_ORDER: SendStatus[] = [
  "scheduled",
  "handwriting",
  "assembling",
  "shipped",
  "delivered",
];
