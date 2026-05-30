import "server-only";
import { prisma } from "./prisma";
import { applySendAction, nextGiftForRecipient } from "./db";
import { submitHandwriting } from "./handwriting";
import { sendEmail, brandedEmail } from "./email";
import { getProduct } from "./catalog";
import { formatAddress, type Cadence } from "./types";
import { appUrl } from "./urls";

// The auto-send engine, modeled on how Client Giant runs touches:
//  1. ensureRecurringTouches — keep the next quarterly/monthly/annual touch queued
//  2. notifyUpcoming        — email a heads-up before each send (pause/skip window)
//  3. releaseDue            — auto-advance due sends into fulfillment (the "send")
//
// Runs across all accounts (cron) or one account (in-app "Run now").

const NOTIFY_WINDOW_DAYS = 3;
// Top of Mind announce months: Mar, Jun, Sep, Dec (0-indexed 2,5,8,11).
const QUARTER_MONTHS = [2, 5, 8, 11];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
function plusDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function nextCadenceDate(cadence: Cadence, from = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  if (cadence === "monthly") {
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  }
  if (cadence === "annually") {
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  }
  // quarterly → the 15th of the next Top-of-Mind announce month.
  let year = d.getFullYear();
  const month = QUARTER_MONTHS.find((m) => m > d.getMonth());
  let target = month;
  if (target === undefined) {
    target = QUARTER_MONTHS[0];
    year += 1;
  }
  return new Date(year, target, 15).toISOString().slice(0, 10);
}

export interface SchedulerSummary {
  created: number;
  notified: number;
  released: number;
}

export async function runScheduler(opts: { userId?: string } = {}): Promise<SchedulerSummary> {
  const scope = opts.userId ? { userId: opts.userId } : {};
  const [created, notified, released] = await Promise.all([
    ensureRecurringTouches(scope),
    notifyUpcoming(scope),
    releaseDue(scope),
  ]);
  return { created, notified, released };
}

async function ensureRecurringTouches(scope: { userId?: string }): Promise<number> {
  const automations = await prisma.automation.findMany({
    where: { active: true, cadence: { not: "one_time" }, ...scope },
  });
  let created = 0;

  for (const a of automations) {
    const recipients = await prisma.recipient.findMany({
      where: {
        userId: a.userId,
        ...(a.audienceFilter !== "all" ? { audience: a.audienceFilter } : {}),
      },
    });

    for (const r of recipients) {
      if (a.tagFilter && !r.tags.split(",").includes(a.tagFilter)) continue;

      // One open touch per (automation, recipient) at a time.
      const open = await prisma.send.findFirst({
        where: { automationId: a.id, recipientId: r.id, status: { in: ["scheduled", "paused"] } },
      });
      if (open) continue;

      // Rotate gifts so a recurring program never repeats the same one.
      const giftId = await nextGiftForRecipient(a.userId, r.id, a.giftId);

      await prisma.send.create({
        data: {
          userId: a.userId,
          recipientId: r.id,
          giftId,
          occasion: a.triggerOccasion,
          status: "scheduled",
          scheduledFor: nextCadenceDate(a.cadence as Cadence),
          note: a.noteTemplate.replaceAll("{firstName}", r.firstName),
          reason: `Recurring ${a.cadence} “Top of Mind” touch from “${a.name}” (rotated to avoid repeats)`,
          automationId: a.id,
          source: "app",
        },
      });
      created++;
    }
  }
  return created;
}

async function notifyUpcoming(scope: { userId?: string }): Promise<number> {
  const start = today();
  const end = plusDays(start, NOTIFY_WINDOW_DAYS);
  const sends = await prisma.send.findMany({
    where: { status: "scheduled", notifiedAt: null, scheduledFor: { gte: start, lte: end }, ...scope },
    include: { recipient: true, user: true },
  });

  let notified = 0;
  for (const s of sends) {
    const p = getProduct(s.giftId);
    await sendEmail({
      to: s.user.email,
      subject: `A gift for ${s.recipient.firstName} mails ${s.scheduledFor}`,
      html: brandedEmail(
        "A touch is going out soon ✨",
        `“${p?.name ?? "A gift"}” for <b>${s.recipient.firstName} ${s.recipient.lastName}</b> is scheduled to mail on <b>${s.scheduledFor}</b>. Need to change it? You can pause, skip, delay, or expedite it from your pipeline.`,
        { label: "Review this touch", url: appUrl("/dashboard/sends") },
      ),
    });
    await prisma.send.update({ where: { id: s.id }, data: { notifiedAt: new Date() } });
    notified++;
  }
  return notified;
}

async function releaseDue(scope: { userId?: string }): Promise<number> {
  const due = await prisma.send.findMany({
    where: { status: "scheduled", scheduledFor: { lte: today() }, ...scope },
    include: { recipient: true },
  });

  let released = 0;
  for (const s of due) {
    // Auto-advance scheduled → handwriting and submit to the pen provider.
    await applySendAction(s.userId, s.id, "advance");
    const r = s.recipient;
    await submitHandwriting({
      sendId: s.id,
      recipientName: `${r.firstName} ${r.lastName}`,
      address: formatAddress(r),
      recipient: {
        name: `${r.firstName} ${r.lastName}`,
        address1: r.address1,
        address2: r.address2,
        city: r.city,
        state: r.state,
        zip: r.zip,
        country: r.country,
      },
      note: s.note,
      style: getProduct(s.giftId)?.category === "letter" ? "santa-script" : "casual-script",
    });
    released++;
  }
  return released;
}
