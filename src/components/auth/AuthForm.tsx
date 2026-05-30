"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, signupAction, type AuthState } from "@/app/actions/auth";
import { fieldClass, labelClass } from "@/components/ui/Modal";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? loginAction : signupAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label className={labelClass}>Your name</label>
          <input name="name" required className={fieldClass} placeholder="Jamie Rivera" autoComplete="name" />
        </div>
      )}
      <div>
        <label className={labelClass}>Email</label>
        <input
          name="email"
          type="email"
          required
          className={fieldClass}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          className={fieldClass}
          placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        {mode === "login" && (
          <Link
            href="/forgot-password"
            className="mt-1.5 block text-right text-xs font-medium text-pine-500 hover:text-pine-700"
          >
            Forgot password?
          </Link>
        )}
      </div>

      {state.error && (
        <p className="rounded-xl bg-berry-500/10 px-3.5 py-2.5 text-sm text-berry-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-pine-700 px-5 py-3 font-semibold text-cream shadow-card transition hover:bg-pine-600 disabled:opacity-60"
      >
        {pending ? "One moment…" : mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="text-center text-sm text-pine-600">
        {mode === "login" ? (
          <>
            New to Kringle?{" "}
            <Link href="/signup" className="font-semibold text-pine-800 underline-offset-4 hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-pine-800 underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
