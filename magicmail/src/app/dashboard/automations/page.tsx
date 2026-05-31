import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AutomationsManager } from "@/components/dashboard/AutomationsManager";
import { requireUserId } from "@/lib/auth";
import { CATALOG } from "@/lib/catalog";
import { listAutomations } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const automations = await listAutomations(userId);
  const products = CATALOG.map((p) => ({ id: p.id, name: p.name, emoji: p.emoji }));

  return (
    <>
      <PageHeader
        title="Automations"
        subtitle="Set a moment once — Kringle watches the calendar and sends the gift."
      />
      <AutomationsManager automations={automations} products={products} />
    </>
  );
}
