"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "landing" }),
    });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <p className="mx-auto mt-8 max-w-md rounded-full border border-gold-300/40 bg-cream/10 px-6 py-3 text-cream">
        ✨ You&apos;re on the list — we&apos;ll be in touch with a little magic.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-full border border-cream/20 bg-cream/10 px-5 py-3 text-cream placeholder:text-cream/50 focus:border-gold-300 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-full bg-gold-300 px-6 py-3 font-semibold text-pine-900 transition hover:bg-gold-200 disabled:opacity-60"
      >
        {state === "loading" ? "Joining…" : "Join waitlist"}
      </button>
    </form>
  );
}
