import { getProduct } from "./catalog";
import { listAutomations, listRecipients, listSends } from "./store";

export interface DashboardMetrics {
  recipients: number;
  activeAutomations: number;
  inFlight: number; // sends not yet delivered
  deliveredThisYear: number;
  revenueScheduled: number; // retail value of all non-delivered sends
  marginRate: number; // blended gross margin across all sends, 0..1
  upcoming: number; // sends scheduled in the next 30 days
}

export function computeMetrics(): DashboardMetrics {
  const sends = listSends();
  const automations = listAutomations();
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
  const revenueScheduled = inFlight.reduce(
    (sum, s) => sum + (getProduct(s.giftId)?.price ?? 0),
    0,
  );

  return {
    recipients: listRecipients().length,
    activeAutomations: automations.filter((a) => a.active).length,
    inFlight: inFlight.length,
    deliveredThisYear: sends.filter(
      (s) => s.status === "delivered" && new Date(s.deliveredOn ?? s.scheduledFor).getFullYear() === now.getFullYear(),
    ).length,
    revenueScheduled,
    marginRate: revenue > 0 ? (revenue - cost) / revenue : 0,
    upcoming: sends.filter((s) => {
      const d = new Date(s.scheduledFor + "T00:00:00");
      return s.status !== "delivered" && d >= now && d <= in30;
    }).length,
  };
}
