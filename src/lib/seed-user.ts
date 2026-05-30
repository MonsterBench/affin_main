import { prisma } from "./prisma";

// Populates an account with realistic sample data so the dashboard is alive
// the moment someone signs up. Safe to call repeatedly — it no-ops if the
// account already has recipients.

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function days(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
}

export async function seedDemoDataFor(userId: string): Promise<void> {
  const count = await prisma.recipient.count({ where: { userId } });
  if (count > 0) return;

  const recipientData = [
    {
      firstName: "Emma", lastName: "Hollis", audience: "kid", city: "Asheville", state: "NC",
      tags: "holiday-list,age-6", notes: "Loves dinosaurs and her dog Biscuit.",
      dates: [{ occasion: "holiday", date: "2026-12-24" }, { occasion: "birthday", date: "2026-06-12" }],
    },
    {
      firstName: "Marcus", lastName: "Reed", audience: "client", company: "Reed & Co. Realty",
      email: "marcus@reedco.com", city: "Charlotte", state: "NC", tags: "vip,real-estate",
      dates: [
        { occasion: "closing", date: days(5), label: "412 Maple St closing" },
        { occasion: "birthday", date: "2026-09-02" },
      ],
    },
    {
      firstName: "Priya", lastName: "Nair", audience: "employee", company: "Northstar Advisors",
      email: "priya@northstar.com", city: "Austin", state: "TX", tags: "team,anniversary-q2",
      dates: [{ occasion: "work_anniversary", date: days(16) }, { occasion: "birthday", date: "2026-07-22" }],
    },
    {
      firstName: "Daniel", lastName: "Okafor", audience: "client", company: "Okafor Wealth",
      email: "dan@okaforwealth.com", city: "Atlanta", state: "GA", tags: "vip,finance",
      dates: [{ occasion: "milestone", date: days(9), label: "10-year client" }],
    },
    {
      firstName: "Sofia", lastName: "Marin", audience: "prospect", company: "Marin Interiors",
      email: "sofia@marininteriors.com", city: "Miami", state: "FL", tags: "lead,design",
      dates: [{ occasion: "thank_you", date: days(2), label: "Intro meeting follow-up" }],
    },
    {
      firstName: "Liam", lastName: "Foster", audience: "kid", city: "Denver", state: "CO",
      tags: "holiday-list,age-4", dates: [{ occasion: "holiday", date: "2026-12-24" }],
    },
    {
      firstName: "Grace", lastName: "Bennett", audience: "client", company: "Bennett Law",
      email: "grace@bennettlaw.com", city: "Nashville", state: "TN", tags: "vip",
      dates: [{ occasion: "birthday", date: days(3) }, { occasion: "work_anniversary", date: "2026-10-01" }],
    },
    {
      firstName: "Noah", lastName: "Park", audience: "employee", company: "Northstar Advisors",
      email: "noah@northstar.com", city: "Seattle", state: "WA", tags: "team",
      dates: [{ occasion: "work_anniversary", date: days(21) }],
    },
  ];

  const recipients: Record<string, string> = {};
  for (const r of recipientData) {
    const created = await prisma.recipient.create({
      data: {
        userId,
        firstName: r.firstName, lastName: r.lastName, audience: r.audience,
        company: r.company, email: r.email, city: r.city, state: r.state, tags: r.tags,
        notes: r.notes,
        importantDates: {
          create: r.dates.map((d) => ({
            occasion: d.occasion,
            date: d.date,
            label: (d as { label?: string }).label,
          })),
        },
      },
    });
    recipients[`${r.firstName} ${r.lastName}`] = created.id;
  }

  await prisma.automation.createMany({
    data: [
      {
        userId, name: "Christmas Eve Santa Letters", triggerOccasion: "holiday",
        giftId: "santa-letter-deluxe", leadTimeDays: 10, audienceFilter: "kid", active: true,
        noteTemplate: "Dear {firstName}, I've been watching from the North Pole and you're on the Nice List…",
      },
      {
        userId, name: "Closing-day Welcome Home", triggerOccasion: "closing",
        giftId: "welcome-home-box", leadTimeDays: 2, audienceFilter: "client", tagFilter: "real-estate",
        active: true,
        noteTemplate: "Congratulations on your new home, {firstName}! Wishing you many happy memories here.",
      },
      {
        userId, name: "Team Work Anniversaries", triggerOccasion: "work_anniversary",
        giftId: "milestone-keepsake", leadTimeDays: 5, audienceFilter: "employee", active: true,
        noteTemplate: "{firstName}, thank you for another incredible year. We're so glad you're on the team.",
      },
      {
        userId, name: "VIP Client Birthdays", triggerOccasion: "birthday",
        giftId: "celebration-treats", leadTimeDays: 4, audienceFilter: "client", tagFilter: "vip",
        active: false,
        noteTemplate: "Happy birthday, {firstName}! Hope your day is as wonderful as you are.",
      },
    ],
  });

  const sendData = [
    { who: "Sofia Marin", giftId: "gratitude-card", occasion: "thank_you", status: "shipped", scheduledFor: days(-1), trackingNumber: "9400 1112 3456 7890", note: "Sofia, it was so great meeting you — looking forward to working together!" },
    { who: "Marcus Reed", giftId: "welcome-home-box", occasion: "closing", status: "assembling", scheduledFor: days(3), note: "Congratulations on 412 Maple St, Marcus!" },
    { who: "Daniel Okafor", giftId: "milestone-keepsake", occasion: "milestone", status: "handwriting", scheduledFor: days(4), note: "Daniel, ten years — thank you for your trust all this time." },
    { who: "Grace Bennett", giftId: "celebration-treats", occasion: "birthday", status: "scheduled", scheduledFor: days(3), note: "Happy birthday, Grace!" },
    { who: "Priya Nair", giftId: "milestone-keepsake", occasion: "work_anniversary", status: "scheduled", scheduledFor: days(11), note: "Priya, thank you for another incredible year." },
    { who: "Noah Park", giftId: "milestone-keepsake", occasion: "work_anniversary", status: "scheduled", scheduledFor: days(16), note: "Noah, thank you for another incredible year." },
    { who: "Emma Hollis", giftId: "celebration-treats", occasion: "birthday", status: "delivered", scheduledFor: days(-8), deliveredOn: days(-5), trackingNumber: "9400 1145 9921 0034", note: "Happy birthday, Emma!" },
    { who: "Daniel Okafor", giftId: "fresh-start-box", occasion: "new_client", status: "delivered", scheduledFor: days(-40), deliveredOn: days(-36), trackingNumber: "9400 1167 2210 8845", note: "Welcome aboard, Daniel!" },
  ];

  for (const s of sendData) {
    await prisma.send.create({
      data: {
        userId, recipientId: recipients[s.who], giftId: s.giftId, occasion: s.occasion,
        status: s.status, scheduledFor: s.scheduledFor, deliveredOn: s.deliveredOn,
        trackingNumber: s.trackingNumber, note: s.note,
      },
    });
  }
}
