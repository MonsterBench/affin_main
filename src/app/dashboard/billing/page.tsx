import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BillingPlans } from "@/components/dashboard/BillingPlans";
import { getCurrentUser } from "@/lib/auth";
import { billingIsLive } from "@/lib/stripe";
import { getPlan, type PlanId } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { status } = await searchParams;
  const plan = getPlan(user.plan);

  return (
    <>
      <PageHeader
        title="Billing & plans"
        subtitle="Upgrade as your thoughtfulness scales. Gifts are billed separately at fulfillment."
      />

      {status === "success" && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          🎉 You&apos;re all set — your subscription is active.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pine-100 bg-white p-5 shadow-card">
        <div>
          <p className="text-sm text-pine-500">Current plan</p>
          <p className="font-display text-xl font-semibold text-pine-800">{plan.name}</p>
        </div>
        {!billingIsLive && (
          <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-600">
            Demo mode — add Stripe keys to enable live checkout
          </span>
        )}
      </div>

      <BillingPlans currentPlan={user.plan as PlanId} live={billingIsLive} />
    </>
  );
}
