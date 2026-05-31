"use client";

import { useActionState } from "react";
import { resetPasswordAction, type AuthState } from "@/app/actions/auth";
import { fieldClass, labelClass } from "@/components/ui/Modal";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(resetPasswordAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className={labelClass}>New password</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className={fieldClass}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-berry-500/10 px-3.5 py-2.5 text-sm text-berry-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-pine-700 px-5 py-3 font-semibold text-cream shadow-card transition hover:bg-pine-600 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}
