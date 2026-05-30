"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction, type AuthState } from "@/app/actions/auth";
import { fieldClass, labelClass } from "@/components/ui/Modal";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(requestPasswordResetAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={labelClass}>Email</label>
        <input name="email" type="email" required className={fieldClass} placeholder="you@example.com" autoComplete="email" />
      </div>

      {state.error && (
        <p className="rounded-xl bg-berry-500/10 px-3.5 py-2.5 text-sm text-berry-600">{state.error}</p>
      )}
      {state.notice && (
        <div className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
          {state.notice}
          {state.devLink && (
            <Link href={state.devLink} className="mt-1 block break-all font-medium underline">
              {state.devLink}
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-pine-700 px-5 py-3 font-semibold text-cream shadow-card transition hover:bg-pine-600 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>

      <p className="text-center text-sm text-pine-600">
        <Link href="/login" className="font-semibold text-pine-800 underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
