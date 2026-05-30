import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Verify your email" };
export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let ok = false;

  if (token) {
    const user = await prisma.user.findUnique({ where: { verifyToken: token } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, verifyToken: null },
      });
      ok = true;
    }
  }

  return (
    <AuthShell
      title={ok ? "Email verified 🎉" : "Verification failed"}
      subtitle={ok ? "Thanks for confirming — your account is all set." : "This link is invalid or has already been used."}
    >
      <Link
        href={ok ? "/dashboard" : "/login"}
        className="inline-block rounded-full bg-pine-700 px-6 py-3 font-semibold text-cream shadow-card transition hover:bg-pine-600"
      >
        {ok ? "Go to dashboard" : "Back to sign in"}
      </Link>
    </AuthShell>
  );
}
