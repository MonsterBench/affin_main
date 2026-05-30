"use client";

import { useState } from "react";

const EMOJI = ["❤️", "😍", "🥰", "🤩", "😭", "🎉"];

export function ReactionForm({ token, childName, done }: { token: string; childName: string; done: boolean }) {
  const [sent, setSent] = useState(done);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [fromName, setFromName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="rounded-3xl border border-gold-300/30 bg-cream/5 p-6 text-center">
        <p className="text-3xl">💌</p>
        <p className="mt-2 font-display text-lg text-cream">Thank you! Your reaction is on its way back to the sender.</p>
      </div>
    );
  }

  async function submit() {
    if (!emoji && !message.trim()) return setError("Pick an emoji or write a little something.");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/magic/${token}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji, message, fromName }),
      });
      if (res.ok) setSent(true);
      else setError("Something went wrong — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-gold-300/30 bg-cream/5 p-6">
      <p className="font-display text-lg font-semibold text-gold-300">Send a reaction back 💌</p>
      <p className="mt-1 text-sm text-cream/75">Let the person who sent this know how {childName} felt.</p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {EMOJI.map((e) => (
          <button
            key={e}
            onClick={() => setEmoji(emoji === e ? null : e)}
            className={`grid h-12 w-12 place-items-center rounded-full text-2xl transition ${
              emoji === e ? "bg-gold-300 ring-2 ring-gold-200" : "bg-cream/10 hover:bg-cream/20"
            }`}
            aria-label={`React ${e}`}
          >
            {e}
          </button>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder={`A thank-you note (optional)…`}
        className="mt-4 w-full rounded-xl border border-cream/20 bg-pine-900/40 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold-300 focus:outline-none"
      />
      <input
        value={fromName}
        onChange={(e) => setFromName(e.target.value)}
        placeholder="Your name (optional)"
        className="mt-3 w-full rounded-xl border border-cream/20 bg-pine-900/40 px-4 py-2.5 text-cream placeholder:text-cream/40 focus:border-gold-300 focus:outline-none"
      />

      {error && <p className="mt-3 text-sm text-gold-200">{error}</p>}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-4 w-full rounded-full bg-gold-300 px-5 py-3 font-semibold text-pine-900 transition hover:bg-gold-200 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send reaction"}
      </button>
    </div>
  );
}
