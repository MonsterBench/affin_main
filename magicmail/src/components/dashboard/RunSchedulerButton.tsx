"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RunSchedulerButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    const res = await fetch("/api/scheduler/run", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (d.ok) {
      setMsg(`Queued ${d.created} · notified ${d.notified} · released ${d.released}`);
      router.refresh();
      setTimeout(() => setMsg(null), 6000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {msg && <span className="hidden text-xs text-pine-500 sm:inline">{msg}</span>}
      <button
        onClick={run}
        disabled={busy}
        title="Queue recurring touches, send heads-up emails, and auto-release due gifts"
        className="rounded-full border border-pine-300 px-4 py-2 text-sm font-semibold text-pine-700 transition hover:bg-pine-50 disabled:opacity-60"
      >
        {busy ? "Running…" : "⚙︎ Run scheduler"}
      </button>
    </div>
  );
}
