import "server-only";
import { prisma } from "./prisma";
import { getProduct } from "./catalog";
import { STATUS_ORDER } from "./types";
import type {
  AudienceKind,
  Automation,
  Cadence,
  ImportantDate,
  OccasionType,
  Recipient,
  Send,
  SendAction,
  SendStatus,
} from "./types";
import { OCCASION_LABELS } from "./types";

// Data access layer. Everything is scoped to a userId for multi-tenant safety,
// and rows are mapped into the app's domain types so the UI is storage-agnostic.

type RecipientRow = {
  id: string;
  firstName: string;
  lastName: string;
  audience: string;
  company: string | null;
  email: string | null;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  tags: string;
  notes: string | null;
  createdAt: Date;
  importantDates: { occasion: string; date: string; label: string | null }[];
};

function toRecipient(r: RecipientRow): Recipient {
  return {
    id: r.id,
    firstName: r.firstName,
    lastName: r.lastName,
    audience: r.audience as AudienceKind,
    company: r.company ?? undefined,
    email: r.email ?? undefined,
    address1: r.address1,
    address2: r.address2,
    city: r.city,
    state: r.state,
    zip: r.zip,
    country: r.country,
    tags: r.tags ? r.tags.split(",").filter(Boolean) : [],
    notes: r.notes ?? undefined,
    importantDates: r.importantDates.map((d) => ({
      occasion: d.occasion as OccasionType,
      date: d.date,
      label: d.label ?? undefined,
    })),
    createdAt: r.createdAt.toISOString().slice(0, 10),
  };
}

// ---- Recipients -----------------------------------------------------------
export async function listRecipients(userId: string): Promise<Recipient[]> {
  const rows = await prisma.recipient.findMany({
    where: { userId },
    include: { importantDates: true },
    orderBy: { firstName: "asc" },
  });
  return rows.map(toRecipient);
}

export async function addRecipient(
  userId: string,
  input: Omit<Recipient, "id" | "createdAt">,
): Promise<Recipient> {
  const row = await prisma.recipient.create({
    data: {
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      audience: input.audience,
      company: input.company,
      email: input.email,
      address1: input.address1,
      address2: input.address2,
      city: input.city,
      state: input.state,
      zip: input.zip,
      country: input.country,
      tags: input.tags.join(","),
      notes: input.notes,
      importantDates: {
        create: input.importantDates.map((d: ImportantDate) => ({
          occasion: d.occasion,
          date: d.date,
          label: d.label,
        })),
      },
    },
    include: { importantDates: true },
  });
  return toRecipient(row);
}

// ---- Automations ----------------------------------------------------------
function toAutomation(a: {
  id: string;
  name: string;
  triggerOccasion: string;
  giftId: string;
  leadTimeDays: number;
  audienceFilter: string;
  tagFilter: string | null;
  cadence: string;
  active: boolean;
  noteTemplate: string;
  createdAt: Date;
}): Automation {
  return {
    id: a.id,
    name: a.name,
    triggerOccasion: a.triggerOccasion as OccasionType,
    giftId: a.giftId,
    leadTimeDays: a.leadTimeDays,
    audienceFilter: a.audienceFilter as AudienceKind | "all",
    tagFilter: a.tagFilter ?? undefined,
    cadence: a.cadence as Cadence,
    active: a.active,
    noteTemplate: a.noteTemplate,
    createdAt: a.createdAt.toISOString().slice(0, 10),
  };
}

export async function listAutomations(userId: string): Promise<Automation[]> {
  const rows = await prisma.automation.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toAutomation);
}

export async function addAutomation(
  userId: string,
  input: Omit<Automation, "id" | "createdAt">,
): Promise<Automation> {
  const row = await prisma.automation.create({
    data: {
      userId,
      name: input.name,
      triggerOccasion: input.triggerOccasion,
      giftId: input.giftId,
      leadTimeDays: input.leadTimeDays,
      audienceFilter: input.audienceFilter,
      tagFilter: input.tagFilter,
      cadence: input.cadence,
      active: input.active,
      noteTemplate: input.noteTemplate,
    },
  });
  return toAutomation(row);
}

export async function toggleAutomation(
  userId: string,
  id: string,
): Promise<Automation | null> {
  const existing = await prisma.automation.findFirst({ where: { id, userId } });
  if (!existing) return null;
  const row = await prisma.automation.update({
    where: { id },
    data: { active: !existing.active },
  });
  return toAutomation(row);
}

// ---- Sends ----------------------------------------------------------------
function toSend(s: {
  id: string;
  recipientId: string;
  giftId: string;
  occasion: string;
  status: string;
  scheduledFor: string;
  deliveredOn: string | null;
  trackingNumber: string | null;
  note: string;
  reason: string | null;
  automationId: string | null;
  createdAt: Date;
}): Send {
  return {
    id: s.id,
    recipientId: s.recipientId,
    giftId: s.giftId,
    occasion: s.occasion as OccasionType,
    status: s.status as SendStatus,
    scheduledFor: s.scheduledFor,
    deliveredOn: s.deliveredOn ?? undefined,
    trackingNumber: s.trackingNumber ?? undefined,
    note: s.note,
    reason: s.reason ?? undefined,
    automationId: s.automationId ?? undefined,
    createdAt: s.createdAt.toISOString().slice(0, 10),
  };
}

export async function listSends(userId: string): Promise<Send[]> {
  const rows = await prisma.send.findMany({
    where: { userId },
    orderBy: { scheduledFor: "asc" },
  });
  return rows.map(toSend);
}

export async function addSend(
  userId: string,
  input: Omit<Send, "id" | "createdAt">,
): Promise<Send | null> {
  // Ensure the recipient belongs to this user.
  const recipient = await prisma.recipient.findFirst({
    where: { id: input.recipientId, userId },
  });
  if (!recipient) return null;
  const row = await prisma.send.create({
    data: {
      userId,
      recipientId: input.recipientId,
      giftId: input.giftId,
      occasion: input.occasion,
      status: input.status,
      scheduledFor: input.scheduledFor,
      note: input.note,
      reason: input.reason,
      automationId: input.automationId,
    },
  });
  return toSend(row);
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// Per-touch controls inspired by Client Giant: advance through fulfillment, or
// pause / resume / skip / delay / expedite an upcoming send.
export async function applySendAction(
  userId: string,
  id: string,
  action: SendAction,
): Promise<Send | null> {
  const existing = await prisma.send.findFirst({ where: { id, userId } });
  if (!existing) return null;
  const status = existing.status as SendStatus;
  const today = new Date().toISOString().slice(0, 10);
  const data: {
    status?: string;
    trackingNumber?: string;
    deliveredOn?: string;
    scheduledFor?: string;
  } = {};

  switch (action) {
    case "advance": {
      // Only sends already in the linear pipeline can advance.
      const i = STATUS_ORDER.indexOf(status);
      if (i < 0 || i >= STATUS_ORDER.length - 1) return toSend(existing);
      const next = STATUS_ORDER[i + 1] as SendStatus;
      data.status = next;
      if (next === "shipped" && !existing.trackingNumber) {
        data.trackingNumber = `9400 ${rand()} ${rand()} ${rand()}`;
      }
      if (next === "delivered") data.deliveredOn = today;
      break;
    }
    case "pause":
      if (status !== "scheduled") return toSend(existing);
      data.status = "paused";
      break;
    case "resume":
      if (status !== "paused") return toSend(existing);
      data.status = "scheduled";
      break;
    case "skip":
      if (status !== "scheduled" && status !== "paused") return toSend(existing);
      data.status = "skipped";
      break;
    case "delay":
      if (status !== "scheduled" && status !== "paused") return toSend(existing);
      data.scheduledFor = addDays(existing.scheduledFor, 7);
      break;
    case "expedite": {
      if (status !== "scheduled" && status !== "paused") return toSend(existing);
      const pulled = addDays(existing.scheduledFor, -3);
      data.scheduledFor = pulled < today ? today : pulled;
      break;
    }
  }

  const row = await prisma.send.update({ where: { id }, data });
  return toSend(row);
}

function rand(): number {
  return Math.floor(1000 + Math.random() * 8999);
}

// ---- Metrics --------------------------------------------------------------
export interface DashboardMetrics {
  recipients: number;
  activeAutomations: number;
  inFlight: number;
  deliveredThisYear: number;
  revenueScheduled: number;
  marginRate: number;
  upcoming: number;
}

export async function computeMetrics(userId: string): Promise<DashboardMetrics> {
  const [recipientCount, automations, sends] = await Promise.all([
    prisma.recipient.count({ where: { userId } }),
    listAutomations(userId),
    listSends(userId),
  ]);

  const now = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);

  let revenue = 0;
  let cost = 0;
  for (const s of sends) {
    const p = getProduct(s.giftId);
    if (!p) continue;
    revenue += p.price;
    cost += p.cost;
  }

  // "In flight" = active sends still working through the pipeline.
  const inFlight = sends.filter((s) => s.status !== "delivered" && s.status !== "skipped");

  return {
    recipients: recipientCount,
    activeAutomations: automations.filter((a) => a.active).length,
    inFlight: inFlight.length,
    deliveredThisYear: sends.filter(
      (s) =>
        s.status === "delivered" &&
        new Date(s.deliveredOn ?? s.scheduledFor).getFullYear() === now.getFullYear(),
    ).length,
    revenueScheduled: inFlight.reduce((sum, s) => sum + (getProduct(s.giftId)?.price ?? 0), 0),
    marginRate: revenue > 0 ? (revenue - cost) / revenue : 0,
    upcoming: sends.filter((s) => {
      const d = new Date(s.scheduledFor + "T00:00:00");
      return s.status === "scheduled" && d >= now && d <= in30;
    }).length,
  };
}

// ---- Waitlist -------------------------------------------------------------
export async function addToWaitlist(email: string, source?: string): Promise<boolean> {
  try {
    await prisma.waitlistEntry.upsert({
      where: { email },
      update: {},
      create: { email, source },
    });
    return true;
  } catch {
    return false;
  }
}

// ---- Integrations (CRM / Zapier) -----------------------------------------
export async function getOrCreateApiKey(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.apiKey) return user.apiKey;
  const key = `kk_live_${randomToken(32)}`;
  await prisma.user.update({ where: { id: userId }, data: { apiKey: key } });
  return key;
}

export async function rotateApiKey(userId: string): Promise<string> {
  const key = `kk_live_${randomToken(32)}`;
  await prisma.user.update({ where: { id: userId }, data: { apiKey: key } });
  return key;
}

export async function userIdForApiKey(apiKey: string): Promise<string | null> {
  if (!apiKey) return null;
  const user = await prisma.user.findUnique({ where: { apiKey } });
  return user?.id ?? null;
}

export interface TriggerInput {
  occasion: OccasionType;
  firstName: string;
  lastName: string;
  email?: string;
  company?: string;
  city?: string;
  state?: string;
  tags?: string[];
  date?: string; // when the occasion happens (defaults to today)
}

export interface TriggerResult {
  recipientId: string;
  scheduled: { sendId: string; automationName: string; giftId: string; scheduledFor: string }[];
  matchedAutomations: number;
}

// Inbound CRM/Zapier event → upsert the recipient and fire matching automations.
export async function triggerFromEvent(userId: string, input: TriggerInput): Promise<TriggerResult> {
  const tags = input.tags ?? [];
  const occasionDate = input.date ?? new Date().toISOString().slice(0, 10);

  // Find or create the recipient by name + email within this account.
  let recipient = await prisma.recipient.findFirst({
    where: {
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      ...(input.email ? { email: input.email } : {}),
    },
  });
  if (!recipient) {
    recipient = await prisma.recipient.create({
      data: {
        userId,
        firstName: input.firstName,
        lastName: input.lastName,
        audience: "client",
        email: input.email,
        company: input.company,
        city: input.city ?? "",
        state: input.state ?? "",
        tags: tags.join(","),
        importantDates: { create: [{ occasion: input.occasion, date: occasionDate }] },
      },
    });
  }

  // Match active automations for this occasion + audience/tag filters.
  const automations = await prisma.automation.findMany({
    where: { userId, triggerOccasion: input.occasion, active: true },
  });
  const recipientTags = recipient.tags ? recipient.tags.split(",").filter(Boolean) : tags;

  const scheduled: TriggerResult["scheduled"] = [];
  for (const a of automations) {
    if (a.audienceFilter !== "all" && a.audienceFilter !== recipient.audience) continue;
    if (a.tagFilter && !recipientTags.includes(a.tagFilter)) continue;

    const scheduledFor = addDays(occasionDate, -a.leadTimeDays);
    const note = a.noteTemplate.replaceAll("{firstName}", recipient.firstName);
    const send = await prisma.send.create({
      data: {
        userId,
        recipientId: recipient.id,
        giftId: a.giftId,
        occasion: input.occasion,
        status: "scheduled",
        scheduledFor: scheduledFor < occasionDate ? scheduledFor : occasionDate,
        note,
        reason: `Triggered by “${a.name}” from a ${OCCASION_LABELS[input.occasion]} event`,
        automationId: a.id,
      },
    });
    scheduled.push({ sendId: send.id, automationName: a.name, giftId: a.giftId, scheduledFor: send.scheduledFor });
  }

  return { recipientId: recipient.id, scheduled, matchedAutomations: scheduled.length };
}

function randomToken(len: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// ---- Consumer storefront (one-off gift purchases) -------------------------
const STOREFRONT_EMAIL = "storefront@kriskringlemail.com";

async function storefrontUserId(): Promise<string> {
  const existing = await prisma.user.findUnique({ where: { email: STOREFRONT_EMAIL } });
  if (existing) return existing.id;
  const user = await prisma.user.create({
    data: {
      email: STOREFRONT_EMAIL,
      name: "Kris Kringle Mail Storefront",
      passwordHash: `disabled_${randomToken(24)}`, // no login — internal owner of guest orders
      plan: "business",
      emailVerified: true,
    },
  });
  return user.id;
}

export interface GuestOrderInput {
  buyerEmail: string;
  giftId: string;
  occasion: OccasionType;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  note: string;
}

// Creates a one-off consumer gift order (e.g. a parent buying a single Santa
// letter). Lives under the internal storefront account and flows through the
// same fulfillment pipeline as everything else.
export async function createGuestOrder(input: GuestOrderInput): Promise<string> {
  const userId = await storefrontUserId();
  const recipient = await prisma.recipient.create({
    data: {
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      audience: "family",
      address1: input.address1,
      address2: input.address2 ?? "",
      city: input.city,
      state: input.state,
      zip: input.zip,
      country: input.country || "US",
      tags: "storefront",
      notes: `One-off gift purchased by ${input.buyerEmail}`,
      importantDates: { create: [{ occasion: input.occasion, date: new Date().toISOString().slice(0, 10) }] },
    },
  });

  const send = await prisma.send.create({
    data: {
      userId,
      recipientId: recipient.id,
      giftId: input.giftId,
      occasion: input.occasion,
      status: "scheduled",
      scheduledFor: addDays(new Date().toISOString().slice(0, 10), 2),
      note: input.note,
      reason: `One-off gift purchased by ${input.buyerEmail}`,
      source: "storefront",
    },
  });
  return send.id;
}
