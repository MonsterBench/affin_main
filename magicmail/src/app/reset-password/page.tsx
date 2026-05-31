import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Choose a new password" };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthShell title="Invalid link" subtitle="This password reset link is missing or malformed.">
        <Link href="/forgot-password" className="font-semibold text-pine-800 underline-offset-4 hover:underline">
          Request a new link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password" subtitle="Almost there — pick something secure.">
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
