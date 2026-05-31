"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function initialBanner(): string | null {
  if (typeof window === "undefined") return null;
  const g = new URLSearchParams(window.location.search).get("google");
  if (g === "connected") return "✓ Google Calendar connected — your birthdays are importing.";
  if (g === "error") return "⚠️ Couldn't connect Google. Please try again.";
  return null;
}

interface Conn {
  connected: boolean;
  email?: string;
  syncedAt?: string;
}

export function GoogleCalendarCard({ live, initial }: { live: boolean; initial: Conn }) {
  const router = useRouter();
  const [conn, setConn] = useState<Conn>(initial);
  const [busy, setBusy] = useState<"sync" | "disconnect" | null>(null);
  // Reflect ?google=connected|error after the OAuth round-trip (derived once).
  const [msg, setMsg] = useState<string | null>(initialBanner);

  async function sync() {
    setBusy("sync");
    setMsg(null);
    try {
      const res = await fetch("/api/integrations/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      const d = await res.json().catch(() => ({}));
      if (d.ok) {
        setMsg(`✓ Synced — ${d.created} new, ${d.datesAdded} date${d.datesAdded === 1 ? "" : "s"} imported.`);
        const s = await fetch("/api/integrations/google").then((r) => r.json()).catch(() => null);
        if (s) setConn(s);
        router.refresh();
      } else setMsg(d.error ?? "Sync failed.");
    } finally {
      setBusy(null);
    }
  }

  async function disconnect() {
    setBusy("disconnect");
    try {
      await fetch("/api/integrations/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      setConn({ connected: false });
      setMsg(null);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-pine-800">📅 Google Calendar</h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            conn.connected ? "bg-emerald-100 text-emerald-700" : "bg-pine-50 text-pine-500"
          }`}
        >
          {conn.connected ? "Connected" : "Not connected"}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-pine-600/90">
        Import birthdays & anniversaries from Google Calendar <em>and</em> your Google Contacts, and
        we&apos;ll keep them in sync automatically every day.
      </p>

      {!live ? (
        <p className="mt-4 rounded-xl bg-gold-100/50 px-3.5 py-2.5 text-sm text-pine-700">
          Google Calendar isn&apos;t configured on this server yet. Add <code>GOOGLE_CLIENT_ID</code> and{" "}
          <code>GOOGLE_CLIENT_SECRET</code> to enable it.
        </p>
      ) : conn.connected ? (
        <div className="mt-4">
          <p className="text-sm text-pine-600">
            Connected{conn.email ? ` as ${conn.email}` : ""}
            {conn.syncedAt ? ` · last synced ${new Date(conn.syncedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={sync}
              disabled={busy !== null}
              className="rounded-full bg-pine-700 px-4 py-2 text-sm font-semibold text-cream transition hover:bg-pine-600 disabled:opacity-60"
            >
              {busy === "sync" ? "Syncing…" : "Sync now"}
            </button>
            <button
              onClick={disconnect}
              disabled={busy !== null}
              className="rounded-full border border-berry-400/40 px-4 py-2 text-sm font-semibold text-berry-500 transition hover:bg-berry-500/5 disabled:opacity-60"
            >
              {busy === "disconnect" ? "…" : "Disconnect"}
            </button>
          </div>
        </div>
      ) : (
        <a
          href="/api/integrations/google/start"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-pine-700 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-pine-600"
        >
          Connect Google Calendar
        </a>
      )}

      {msg && <p className="mt-3 rounded-xl bg-pine-50 px-3.5 py-2 text-sm text-pine-700">{msg}</p>}
    </div>
  );
}
