"use client";

import { useState } from "react";
import { resendVerificationAction } from "@/app/actions/auth";

export function VerifyBanner({ email }: { email: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  async function resend() {
    setBusy(true);
    const res = await resendVerificationAction();
    setBusy(false);
    setMsg(res.notice ?? res.error ?? null);
    setLink(res.devLink ?? null);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gold-200 bg-gold-100/50 px-4 py-3 text-sm text-pine-700">
      <span className="font-medium">Please verify your email ({email}).</span>
      {msg ? (
        <span className="text-pine-600">
          {msg}
          {link && (
            <a href={link} className="ml-1 font-medium underline">open link</a>
          )}
        </span>
      ) : (
        <button onClick={resend} disabled={busy} className="font-semibold text-pine-800 underline disabled:opacity-60">
          {busy ? "Sending…" : "Resend verification"}
        </button>
      )}
      <button onClick={() => setDismissed(true)} className="ml-auto text-pine-400 hover:text-pine-600" aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
