"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, getCurrentUser } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import { seedDemoDataFor } from "@/lib/seed-user";
import { sendEmail, brandedEmail, emailIsLive } from "@/lib/email";
import { appUrl } from "@/lib/urls";

export interface AuthState {
  error?: string;
  notice?: string;
  devLink?: string; // surfaced in dev mode so flows are testable without email
}

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const token = () => randomBytes(24).toString("hex");

async function sendVerification(userId: string, email: string, name: string): Promise<string> {
  const verifyToken = token();
  await prisma.user.update({ where: { id: userId }, data: { verifyToken } });
  const url = appUrl(`/verify-email?token=${verifyToken}`);
  await sendEmail({
    to: email,
    subject: "Verify your Kringle email",
    html: brandedEmail(
      `Welcome, ${name}! 🎅`,
      "Confirm your email to secure your account and start sending a little magic.",
      { label: "Verify email", url },
    ),
  });
  return url;
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Please tell us your name." };
  if (!emailRe.test(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists." };

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password) },
  });

  await seedDemoDataFor(user.id);
  await sendVerification(user.id, email, name);
  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Incorrect email or password." };
  }
  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function resendVerificationAction(): Promise<AuthState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in first." };
  if (user.emailVerified) return { notice: "Your email is already verified." };
  const url = await sendVerification(user.id, user.email, user.name);
  return {
    notice: emailIsLive ? "Verification email sent — check your inbox." : "Verification link generated.",
    devLink: emailIsLive ? undefined : url,
  };
}

export async function requestPasswordResetAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!emailRe.test(email)) return { error: "Please enter a valid email." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Always report success to avoid leaking which emails exist.
  if (!user) return { notice: "If that email exists, a reset link is on its way." };

  const resetToken = token();
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) },
  });
  const url = appUrl(`/reset-password?token=${resetToken}`);
  await sendEmail({
    to: email,
    subject: "Reset your Kringle password",
    html: brandedEmail("Reset your password", "Click below to choose a new password. This link expires in 1 hour.", {
      label: "Reset password",
      url,
    }),
  });

  return {
    notice: emailIsLive ? "If that email exists, a reset link is on its way." : "Reset link generated below.",
    devLink: emailIsLive ? undefined : url,
  };
}

export async function resetPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const resetToken = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const user = await prisma.user.findUnique({ where: { resetToken } });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(password), resetToken: null, resetTokenExpiry: null },
  });
  await createSession(user.id);
  redirect("/dashboard");
}
