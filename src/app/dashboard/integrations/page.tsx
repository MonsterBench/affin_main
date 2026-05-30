import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { IntegrationsPanel } from "@/components/dashboard/IntegrationsPanel";
import { requireUserId } from "@/lib/auth";
import { getOrCreateApiKey } from "@/lib/db";
import { appUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const apiKey = await getOrCreateApiKey(userId);

  return (
    <>
      <PageHeader
        title="Integrations"
        subtitle="Trigger gifts automatically from your CRM via Zapier or a direct webhook."
      />
      <IntegrationsPanel apiKey={apiKey} webhookUrl={appUrl("/api/integrations/trigger")} />
    </>
  );
}
