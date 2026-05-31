import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { IntegrationsPanel } from "@/components/dashboard/IntegrationsPanel";
import { GoogleCalendarCard } from "@/components/dashboard/GoogleCalendarCard";
import { requireUserId } from "@/lib/auth";
import { getOrCreateApiKey, getFubApiKey, listIntegrationEvents, getGoogleConnection } from "@/lib/db";
import { googleIsLive } from "@/lib/google";
import { appUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const [apiKey, fubKey, events, google] = await Promise.all([
    getOrCreateApiKey(userId),
    getFubApiKey(userId),
    listIntegrationEvents(userId, 10),
    getGoogleConnection(userId),
  ]);

  return (
    <>
      <PageHeader
        title="Integrations"
        subtitle="Trigger gifts automatically from your CRM via Zapier, Follow Up Boss, or a direct webhook."
      />
      <div className="mb-6">
        <GoogleCalendarCard live={googleIsLive} initial={google} />
      </div>
      <IntegrationsPanel
        apiKey={apiKey}
        webhookUrl={appUrl("/api/integrations/trigger")}
        fubWebhookUrl={appUrl(`/api/integrations/followupboss?key=${apiKey}`)}
        deliveryWebhookUrl={appUrl("/api/webhooks/delivery")}
        fubConnected={Boolean(fubKey)}
        events={events}
      />
    </>
  );
}
