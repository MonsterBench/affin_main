import type {
  Automation,
  Recipient,
  Send,
  SendStatus,
} from "./types";
import { STATUS_ORDER } from "./types";

// ---------------------------------------------------------------------------
// In-memory store.
//
// This is an MVP stand-in for a database: data lives in module state and is
// cached on `globalThis` so it survives hot-reloads in dev. It resets when the
// server restarts. Swap these functions for real persistence (Postgres/Prisma)
// without changing the API routes or UI.
// ---------------------------------------------------------------------------

interface Db {
  recipients: Recipient[];
  automations: Automation[];
  sends: Send[];
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
}

function seed(): Db {
  const recipients: Recipient[] = [
    {
      id: "r1",
      firstName: "Emma",
      lastName: "Hollis",
      audience: "kid",
      city: "Asheville",
      state: "NC",
      tags: ["holiday-list", "age-6"],
      importantDates: [{ occasion: "holiday", date: "2026-12-24" }, { occasion: "birthday", date: "2026-06-12" }],
      notes: "Loves dinosaurs and her dog Biscuit.",
      createdAt: daysFromNow(-120),
    },
    {
      id: "r2",
      firstName: "Marcus",
      lastName: "Reed",
      audience: "client",
      company: "Reed & Co. Realty",
      email: "marcus@reedco.com",
      city: "Charlotte",
      state: "NC",
      tags: ["vip", "real-estate"],
      importantDates: [
        { occasion: "closing", date: "2026-06-04", label: "412 Maple St closing" },
        { occasion: "birthday", date: "2026-09-02" },
      ],
      createdAt: daysFromNow(-95),
    },
    {
      id: "r3",
      firstName: "Priya",
      lastName: "Nair",
      audience: "employee",
      company: "Northstar Advisors",
      email: "priya@northstar.com",
      city: "Austin",
      state: "TX",
      tags: ["team", "anniversary-q2"],
      importantDates: [{ occasion: "work_anniversary", date: "2026-06-15" }, { occasion: "birthday", date: "2026-07-22" }],
      createdAt: daysFromNow(-300),
    },
    {
      id: "r4",
      firstName: "Daniel",
      lastName: "Okafor",
      audience: "client",
      company: "Okafor Wealth",
      email: "dan@okaforwealth.com",
      city: "Atlanta",
      state: "GA",
      tags: ["vip", "finance"],
      importantDates: [{ occasion: "milestone", date: "2026-06-08", label: "10-year client" }],
      createdAt: daysFromNow(-410),
    },
    {
      id: "r5",
      firstName: "Sofia",
      lastName: "Marin",
      audience: "prospect",
      company: "Marin Interiors",
      email: "sofia@marininteriors.com",
      city: "Miami",
      state: "FL",
      tags: ["lead", "design"],
      importantDates: [{ occasion: "thank_you", date: "2026-06-01", label: "Intro meeting follow-up" }],
      createdAt: daysFromNow(-12),
    },
    {
      id: "r6",
      firstName: "Liam",
      lastName: "Foster",
      audience: "kid",
      city: "Denver",
      state: "CO",
      tags: ["holiday-list", "age-4"],
      importantDates: [{ occasion: "holiday", date: "2026-12-24" }],
      createdAt: daysFromNow(-60),
    },
    {
      id: "r7",
      firstName: "Grace",
      lastName: "Bennett",
      audience: "client",
      company: "Bennett Law",
      email: "grace@bennettlaw.com",
      city: "Nashville",
      state: "TN",
      tags: ["vip"],
      importantDates: [{ occasion: "birthday", date: "2026-06-02" }, { occasion: "work_anniversary", date: "2026-10-01" }],
      createdAt: daysFromNow(-220),
    },
    {
      id: "r8",
      firstName: "Noah",
      lastName: "Park",
      audience: "employee",
      company: "Northstar Advisors",
      email: "noah@northstar.com",
      city: "Seattle",
      state: "WA",
      tags: ["team"],
      importantDates: [{ occasion: "work_anniversary", date: "2026-06-20" }],
      createdAt: daysFromNow(-540),
    },
  ];

  const automations: Automation[] = [
    {
      id: "a1",
      name: "Christmas Eve Santa Letters",
      triggerOccasion: "holiday",
      giftId: "santa-letter-deluxe",
      leadTimeDays: 10,
      audienceFilter: "kid",
      active: true,
      noteTemplate: "Dear {firstName}, I've been watching from the North Pole and you're on the Nice List…",
      createdAt: daysFromNow(-200),
    },
    {
      id: "a2",
      name: "Closing-day Welcome Home",
      triggerOccasion: "closing",
      giftId: "welcome-home-box",
      leadTimeDays: 2,
      audienceFilter: "client",
      tagFilter: "real-estate",
      active: true,
      noteTemplate: "Congratulations on your new home, {firstName}! Wishing you many happy memories here.",
      createdAt: daysFromNow(-150),
    },
    {
      id: "a3",
      name: "Team Work Anniversaries",
      triggerOccasion: "work_anniversary",
      giftId: "milestone-keepsake",
      leadTimeDays: 5,
      audienceFilter: "employee",
      active: true,
      noteTemplate: "{firstName}, thank you for another incredible year. We're so glad you're on the team.",
      createdAt: daysFromNow(-180),
    },
    {
      id: "a4",
      name: "VIP Client Birthdays",
      triggerOccasion: "birthday",
      giftId: "celebration-treats",
      leadTimeDays: 4,
      audienceFilter: "client",
      tagFilter: "vip",
      active: false,
      noteTemplate: "Happy birthday, {firstName}! Hope your day is as wonderful as you are.",
      createdAt: daysFromNow(-90),
    },
  ];

  const sends: Send[] = [
    {
      id: "s1",
      recipientId: "r5",
      giftId: "gratitude-card",
      occasion: "thank_you",
      status: "shipped",
      scheduledFor: daysFromNow(-1),
      trackingNumber: "9400 1112 3456 7890",
      note: "Sofia, it was so great meeting you — looking forward to working together!",
      createdAt: daysFromNow(-3),
    },
    {
      id: "s2",
      recipientId: "r2",
      giftId: "welcome-home-box",
      occasion: "closing",
      status: "assembling",
      scheduledFor: daysFromNow(2),
      note: "Congratulations on 412 Maple St, Marcus!",
      automationId: "a2",
      createdAt: daysFromNow(-1),
    },
    {
      id: "s3",
      recipientId: "r4",
      giftId: "milestone-keepsake",
      occasion: "milestone",
      status: "handwriting",
      scheduledFor: daysFromNow(3),
      note: "Daniel, ten years — thank you for your trust all this time.",
      createdAt: daysFromNow(-1),
    },
    {
      id: "s4",
      recipientId: "r7",
      giftId: "celebration-treats",
      occasion: "birthday",
      status: "scheduled",
      scheduledFor: daysFromNow(-2 + 4),
      note: "Happy birthday, Grace!",
      createdAt: daysFromNow(0),
    },
    {
      id: "s5",
      recipientId: "r3",
      giftId: "milestone-keepsake",
      occasion: "work_anniversary",
      status: "scheduled",
      scheduledFor: daysFromNow(10),
      note: "Priya, thank you for another incredible year.",
      automationId: "a3",
      createdAt: daysFromNow(0),
    },
    {
      id: "s6",
      recipientId: "r8",
      giftId: "milestone-keepsake",
      occasion: "work_anniversary",
      status: "scheduled",
      scheduledFor: daysFromNow(15),
      note: "Noah, thank you for another incredible year.",
      automationId: "a3",
      createdAt: daysFromNow(0),
    },
    {
      id: "s7",
      recipientId: "r1",
      giftId: "celebration-treats",
      occasion: "birthday",
      status: "delivered",
      scheduledFor: daysFromNow(-8),
      deliveredOn: daysFromNow(-5),
      trackingNumber: "9400 1145 9921 0034",
      note: "Happy birthday, Emma!",
      createdAt: daysFromNow(-12),
    },
    {
      id: "s8",
      recipientId: "r4",
      giftId: "fresh-start-box",
      occasion: "new_client",
      status: "delivered",
      scheduledFor: daysFromNow(-40),
      deliveredOn: daysFromNow(-36),
      trackingNumber: "9400 1167 2210 8845",
      note: "Welcome aboard, Daniel!",
      createdAt: daysFromNow(-44),
    },
  ];

  return { recipients, automations, sends };
}

const g = globalThis as unknown as { __kringleDb?: Db };
const db: Db = (g.__kringleDb ??= seed());

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---- Recipients -----------------------------------------------------------
export function listRecipients(): Recipient[] {
  return [...db.recipients].sort((a, b) => a.firstName.localeCompare(b.firstName));
}
export function getRecipient(rid: string): Recipient | undefined {
  return db.recipients.find((r) => r.id === rid);
}
export function addRecipient(input: Omit<Recipient, "id" | "createdAt">): Recipient {
  const rec: Recipient = { ...input, id: id("r"), createdAt: new Date().toISOString().slice(0, 10) };
  db.recipients.push(rec);
  return rec;
}

// ---- Automations ----------------------------------------------------------
export function listAutomations(): Automation[] {
  return [...db.automations];
}
export function addAutomation(input: Omit<Automation, "id" | "createdAt">): Automation {
  const a: Automation = { ...input, id: id("a"), createdAt: new Date().toISOString().slice(0, 10) };
  db.automations.push(a);
  return a;
}
export function toggleAutomation(aid: string): Automation | undefined {
  const a = db.automations.find((x) => x.id === aid);
  if (a) a.active = !a.active;
  return a;
}

// ---- Sends ----------------------------------------------------------------
export function listSends(): Send[] {
  return [...db.sends].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
}
export function addSend(input: Omit<Send, "id" | "createdAt">): Send {
  const s: Send = { ...input, id: id("s"), createdAt: new Date().toISOString().slice(0, 10) };
  db.sends.push(s);
  return s;
}
export function advanceSend(sid: string): Send | undefined {
  const s = db.sends.find((x) => x.id === sid);
  if (!s) return undefined;
  const i = STATUS_ORDER.indexOf(s.status);
  if (i < STATUS_ORDER.length - 1) {
    s.status = STATUS_ORDER[i + 1] as SendStatus;
    if (s.status === "shipped" && !s.trackingNumber) {
      s.trackingNumber = `9400 ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(
        1000 + Math.random() * 8999,
      )} ${Math.floor(1000 + Math.random() * 8999)}`;
    }
    if (s.status === "delivered") s.deliveredOn = new Date().toISOString().slice(0, 10);
  }
  return s;
}
