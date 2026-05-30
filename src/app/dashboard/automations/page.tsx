import { PageHeader } from "@/components/dashboard/PageHeader";
import { AutomationsManager } from "@/components/dashboard/AutomationsManager";
import { CATALOG } from "@/lib/catalog";
import { listAutomations } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function AutomationsPage() {
  const automations = listAutomations();
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
