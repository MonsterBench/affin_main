import "server-only";
import { prisma } from "./prisma";
import { getProduct } from "./catalog";
import { STATUS_ORDER } from "./types";
import type {
  AudienceKind,
  Automation,
  ImportantDate,
  OccasionType,
  Recipient,
  Send,
  SendStatus,
} from "./types";

// Data access layer. Everything is scoped to a userId for multi-tenant safety,
// and rows are mapped into the app's domain types so the UI is storage-agnostic.

type RecipientRow = {
  id: string;
  firstName: string;
  lastName: string;
  audience: string;
  company: string | null;
  email: string | null;
  city: string;
  state: string;
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
    city: r.city,
    state: r.state,
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
      city: input.city,
      state: input.state,
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
      automationId: input.automationId,
    },
  });
  return toSend(row);
}

export async function advanceSend(userId: string, id: string): Promise<Send | null> {
  const existing = await prisma.send.findFirst({ where: { id, userId } });
  if (!existing) return null;
  const i = STATUS_ORDER.indexOf(existing.status as SendStatus);
  if (i >= STATUS_ORDER.length - 1) return toSend(existing);

  const next = STATUS_ORDER[i + 1] as SendStatus;
  const data: { status: string; trackingNumber?: string; deliveredOn?: string } = { status: next };
  if (next === "shipped" && !existing.trackingNumber) {
    data.trackingNumber = `9400 ${rand()} ${rand()} ${rand()}`;
  }
  if (next === "delivered") data.deliveredOn = new Date().toISOString().slice(0, 10);

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

  const inFlight = sends.filter((s) => s.status !== "delivered");

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
      return s.status !== "delivered" && d >= now && d <= in30;
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
