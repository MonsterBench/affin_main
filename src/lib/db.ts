import "server-only";
import { prisma } from "./prisma";
import { CATALOG, getProduct } from "./catalog";
import { requestSantaVideo, videoIsLive } from "./video";
import { fetchHandwritingStatus } from "./handwriting";
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

export async function getRecipient(userId: string, id: string): Promise<Recipient | null> {
  const row = await prisma.recipient.findFirst({
    where: { id, userId },
    include: { importantDates: true },
  });
  return row ? toRecipient(row) : null;
}

export async function sendsForRecipient(userId: string, recipientId: string): Promise<Send[]> {
  const rows = await prisma.send.findMany({
    where: { userId, recipientId },
    orderBy: { scheduledFor: "desc" },
  });
  return rows.map(toSend);
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
  fulfillProvider?: string | null;
  fulfillStatus?: string | null;
  fulfillJobId?: string | null;
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
    fulfillProvider: s.fulfillProvider ?? undefined,
    fulfillStatus: s.fulfillStatus ?? undefined,
    fulfillJobId: s.fulfillJobId ?? undefined,
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
        // Parse the yyyy-mm-dd as local time, not UTC, to avoid year-boundary drift.
        new Date((s.deliveredOn ?? s.scheduledFor) + "T00:00:00").getFullYear() === now.getFullYear(),
    ).length,
    revenueScheduled: inFlight.reduce((sum, s) => sum + (getProduct(s.giftId)?.price ?? 0), 0),
    marginRate: revenue > 0 ? (revenue - cost) / revenue : 0,
    upcoming: sends.filter((s) => {
      const d = new Date(s.scheduledFor + "T00:00:00");
      return s.status === "scheduled" && d >= now && d <= in30;
    }).length,
  };
}

// ---- Gift rotation ("gifts never repeat") --------------------------------
// Returns the giftIds already queued/sent to a recipient (any non-skipped send).
export async function giftsSentTo(userId: string, recipientId: string): Promise<Set<string>> {
  const rows = await prisma.send.findMany({
    where: { userId, recipientId, status: { not: "skipped" } },
    select: { giftId: true },
  });
  return new Set(rows.map((r) => r.giftId));
}

// Picks the next gift for a recipient that they haven't received yet, rotating
// within the anchor gift's category (so a quarterly program never repeats).
// Falls back to the anchor once every option has been used.
export async function nextGiftForRecipient(
  userId: string,
  recipientId: string,
  anchorGiftId: string,
): Promise<string> {
  const anchor = getProduct(anchorGiftId);
  // If the anchor gift is unknown, don't rotate across unrelated categories.
  if (!anchor) return anchorGiftId;
  const used = await giftsSentTo(userId, recipientId);
  const pool = CATALOG.filter((p) => p.category === anchor.category);
  const candidates = pool.filter((p) => !used.has(p.id));
  return candidates[0]?.id ?? anchorGiftId;
}

// ---- Reports / ROI --------------------------------------------------------
export interface ReportData {
  delivered: number;
  inFlight: number;
  skipped: number;
  spendDelivered: number;
  spendScheduled: number;
  deliveryRate: number; // delivered / released, 0..1
  byOccasion: { occasion: OccasionType; count: number }[];
  byAudience: { audience: AudienceKind; count: number }[];
  monthly: { label: string; count: number }[];
  topRecipients: { name: string; count: number }[];
}

export async function computeReport(userId: string): Promise<ReportData> {
  const [sends, recipients] = await Promise.all([listSends(userId), listRecipients(userId)]);
  const recById = new Map(recipients.map((r) => [r.id, r]));
  const active = sends.filter((s) => s.status !== "skipped");

  const delivered = active.filter((s) => s.status === "delivered");
  const released = active.filter((s) => s.status !== "scheduled" && s.status !== "paused");
  const inFlight = active.filter((s) => s.status !== "delivered");

  const sum = (arr: typeof sends) => arr.reduce((t, s) => t + (getProduct(s.giftId)?.price ?? 0), 0);

  // By occasion.
  const occ = new Map<OccasionType, number>();
  for (const s of active) occ.set(s.occasion, (occ.get(s.occasion) ?? 0) + 1);

  // By audience.
  const aud = new Map<AudienceKind, number>();
  for (const s of active) {
    const a = recById.get(s.recipientId)?.audience;
    if (a) aud.set(a, (aud.get(a) ?? 0) + 1);
  }

  // Last 6 months by scheduled date.
  const monthly: { label: string; count: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7); // yyyy-mm
    const label = d.toLocaleDateString("en-US", { month: "short" });
    const count = active.filter((s) => s.scheduledFor.slice(0, 7) === key).length;
    monthly.push({ label, count });
  }

  // Top recipients by send count.
  const perRecipient = new Map<string, number>();
  for (const s of active) perRecipient.set(s.recipientId, (perRecipient.get(s.recipientId) ?? 0) + 1);
  const topRecipients = [...perRecipient.entries()]
    .map(([id, count]) => ({ name: recById.has(id) ? `${recById.get(id)!.firstName} ${recById.get(id)!.lastName}` : "Unknown", count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    delivered: delivered.length,
    inFlight: inFlight.length,
    skipped: sends.length - active.length,
    spendDelivered: sum(delivered),
    spendScheduled: sum(inFlight),
    deliveryRate: released.length ? delivered.length / released.length : 0,
    byOccasion: [...occ.entries()].map(([occasion, count]) => ({ occasion, count })).sort((a, b) => b.count - a.count),
    byAudience: [...aud.entries()].map(([audience, count]) => ({ audience, count })).sort((a, b) => b.count - a.count),
    monthly,
    topRecipients,
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

export async function setFubApiKey(userId: string, key: string | null): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { fubApiKey: key || null } });
}

export async function getFubApiKey(userId: string): Promise<string | null> {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  return u?.fubApiKey ?? null;
}

// ---- Integration activity log --------------------------------------------
export async function logIntegrationEvent(
  userId: string,
  input: { source: string; event: string; summary: string; sendsCreated?: number },
): Promise<void> {
  await prisma.integrationEvent.create({
    data: {
      userId,
      source: input.source,
      event: input.event,
      summary: input.summary,
      sendsCreated: input.sendsCreated ?? 0,
    },
  });
}

export interface IntegrationEventRow {
  id: string;
  source: string;
  event: string;
  summary: string;
  sendsCreated: number;
  createdAt: string;
}

export async function listIntegrationEvents(userId: string, limit = 10): Promise<IntegrationEventRow[]> {
  const rows = await prisma.integrationEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id,
    source: r.source,
    event: r.event,
    summary: r.summary,
    sendsCreated: r.sendsCreated,
    createdAt: r.createdAt.toISOString(),
  }));
}

// Provider delivery/tracking callback → update a send's status. Returns the
// owner's email so the caller can notify them.
export async function updateDeliveryStatus(
  sendId: string,
  status: SendStatus,
  trackingNumber?: string,
  scopeUserId?: string, // when set, only this account's sends may be updated
): Promise<{ ok: boolean; ownerEmail?: string; recipientName?: string }> {
  const send = await prisma.send.findFirst({
    where: { id: sendId, ...(scopeUserId ? { userId: scopeUserId } : {}) },
    include: { user: true, recipient: true },
  });
  if (!send) return { ok: false };
  await prisma.send.update({
    where: { id: sendId },
    data: {
      status,
      ...(trackingNumber ? { trackingNumber } : {}),
      ...(status === "delivered" ? { deliveredOn: new Date().toISOString().slice(0, 10) } : {}),
    },
  });
  return {
    ok: true,
    ownerEmail: send.user.email,
    recipientName: `${send.recipient.firstName} ${send.recipient.lastName}`,
  };
}

export interface TriggerInput {
  occasion: OccasionType;
  firstName: string;
  lastName: string;
  email?: string;
  company?: string;
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
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
        address1: input.address1 ?? "",
        city: input.city ?? "",
        state: input.state ?? "",
        zip: input.zip ?? "",
        country: input.country ?? "US",
        tags: tags.join(","),
        importantDates: { create: [{ occasion: input.occasion, date: occasionDate }] },
      },
    });
  } else {
    // Existing recipient: record this occasion's date if we don't have it yet.
    const has = await prisma.importantDate.findFirst({
      where: { recipientId: recipient.id, occasion: input.occasion },
    });
    if (!has) {
      await prisma.importantDate.create({
        data: { recipientId: recipient.id, occasion: input.occasion, date: occasionDate },
      });
    }
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
  styleId?: string;
}

// Creates a one-off consumer gift order (e.g. a parent buying a single Santa
// letter). Lives under the internal storefront account and flows through the
// same fulfillment pipeline as everything else.
export async function createGuestOrder(input: GuestOrderInput): Promise<{ sendId: string; magicToken: string }> {
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

  // Every order gets a QR "magic" experience; Santa letters & holiday gifts also
  // kick off a personalized Pixar-style Santa video via Sentinel.
  const magicToken = `mg_${randomToken(20)}`;
  // Video is an experimental (beta) add-on — only attempt it when Sentinel is
  // actually configured, so the keepsake page never promises a video that
  // won't arrive.
  const wantsVideo = videoIsLive && (input.giftId.startsWith("santa-letter") || input.occasion === "holiday");
  let videoStatus = "none";
  let videoUrl: string | undefined;
  if (wantsVideo) {
    const v = await requestSantaVideo({ token: magicToken, childName: input.firstName, script: input.note });
    videoStatus = v.status;
    videoUrl = v.url;
  }

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
      styleId: input.styleId,
      magicToken,
      videoStatus,
      videoUrl,
    },
  });
  return { sendId: send.id, magicToken };
}

export interface MagicExperience {
  sendId: string;
  childName: string;
  note: string;
  giftName: string;
  videoStatus: string;
  videoUrl?: string;
  hasReaction: boolean;
}

export async function getMagicExperience(token: string): Promise<MagicExperience | null> {
  const send = await prisma.send.findUnique({
    where: { magicToken: token },
    include: { recipient: true, reactions: true },
  });
  if (!send) return null;
  return {
    sendId: send.id,
    childName: send.recipient.firstName,
    note: send.note,
    giftName: getProduct(send.giftId)?.name ?? "a gift",
    videoStatus: send.videoStatus,
    videoUrl: send.videoUrl ?? undefined,
    hasReaction: send.reactions.length > 0,
  };
}

export interface ReactionRow {
  emoji?: string;
  message?: string;
  fromName?: string;
  createdAt: string;
}

// Records a recipient reaction by magic token (public, no auth).
export async function addReactionByToken(
  token: string,
  input: { emoji?: string; message?: string; fromName?: string },
): Promise<boolean> {
  const send = await prisma.send.findUnique({ where: { magicToken: token } });
  if (!send) return false;
  if (!input.emoji && !input.message) return false;
  await prisma.reaction.create({
    data: {
      sendId: send.id,
      emoji: input.emoji,
      message: input.message?.slice(0, 500),
      fromName: input.fromName?.slice(0, 80),
    },
  });
  return true;
}

// Reactions for a user's sends, newest first — surfaced back to the sender.
export async function reactionsForUser(userId: string, limit = 20): Promise<(ReactionRow & { sendId: string; recipientName: string; giftName: string })[]> {
  const rows = await prisma.reaction.findMany({
    where: { send: { userId } },
    include: { send: { include: { recipient: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    sendId: r.sendId,
    emoji: r.emoji ?? undefined,
    message: r.message ?? undefined,
    fromName: r.fromName ?? undefined,
    createdAt: r.createdAt.toISOString(),
    recipientName: `${r.send.recipient.firstName} ${r.send.recipient.lastName}`,
    giftName: getProduct(r.send.giftId)?.name ?? "a gift",
  }));
}

export async function setVideoByToken(token: string, videoUrl: string, status = "ready"): Promise<boolean> {
  const existing = await prisma.send.findUnique({ where: { magicToken: token } });
  if (!existing) return false;
  await prisma.send.update({ where: { magicToken: token }, data: { videoUrl, videoStatus: status } });
  return true;
}

// Map of sendId → magicToken for a user's sends (for printing QR codes).
export async function magicTokensForUser(userId: string): Promise<Record<string, string>> {
  const rows = await prisma.send.findMany({
    where: { userId, magicToken: { not: null } },
    select: { id: true, magicToken: true },
  });
  const out: Record<string, string> = {};
  for (const r of rows) if (r.magicToken) out[r.id] = r.magicToken;
  return out;
}

// ---- Provider status polling ---------------------------------------------
// Queries the fulfillment provider for each dispatched-but-not-finished send,
// updates fulfillStatus, and reflects terminal states into the pipeline:
// "mailed" -> shipped, "delivered" -> delivered. Scope to one user, or all
// (cron). Safe/no-op for manual/axidraw providers and when no key is set.
export async function pollFulfillmentStatuses(opts: { userId?: string } = {}): Promise<{ checked: number; updated: number }> {
  const sends = await prisma.send.findMany({
    where: {
      ...(opts.userId ? { userId: opts.userId } : {}),
      fulfillProvider: { not: null },
      fulfillJobId: { not: null },
      status: { in: ["handwriting", "assembling", "shipped"] },
    },
  });

  let updated = 0;
  for (const s of sends) {
    const next = await fetchHandwritingStatus(s.fulfillProvider ?? "", s.fulfillJobId ?? "");
    if (!next) continue;

    const data: {
      fulfillStatus: string;
      status?: string;
      trackingNumber?: string;
      deliveredOn?: string;
    } = { fulfillStatus: next };

    if (next === "mailed" && s.status !== "shipped" && s.status !== "delivered") {
      data.status = "shipped";
      if (!s.trackingNumber) data.trackingNumber = `HW ${s.fulfillJobId}`;
    } else if (next === "delivered") {
      data.status = "delivered";
      data.deliveredOn = new Date().toISOString().slice(0, 10);
    }

    const changed = data.fulfillStatus !== s.fulfillStatus || (data.status && data.status !== s.status);
    if (!changed) continue;
    await prisma.send.update({ where: { id: s.id }, data });
    updated++;
  }
  return { checked: sends.length, updated };
}
