import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { VerifyBanner } from "@/components/dashboard/VerifyBanner";
import { getCurrentUser } from "@/lib/auth";
import { listRecipients } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const recipients = (await listRecipients(user.id)).map((r) => ({
    id: r.id,
    name: `${r.firstName} ${r.lastName}`,
    firstName: r.firstName,
  }));

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar userName={user.name} userEmail={user.email} plan={user.plan} recipients={recipients} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav userName={user.name} recipients={recipients} />
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            {!user.emailVerified && <VerifyBanner email={user.email} />}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
