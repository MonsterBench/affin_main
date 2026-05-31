import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Create your account" };
export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <AuthShell
      title="Start sending magic"
      subtitle="Create your account — we'll seed it with sample data so you can explore right away."
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
