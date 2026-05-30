"use client";

import { useState } from "react";
import { OCCASION_LABELS } from "@/lib/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-full border border-pine-300 px-3 py-1 text-xs font-semibold text-pine-700 transition hover:bg-pine-50"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function IntegrationsPanel({ apiKey: initialKey, webhookUrl }: { apiKey: string; webhookUrl: string }) {
  const [apiKey, setApiKey] = useState(initialKey);
  const [revealed, setRevealed] = useState(false);
  const [rotating, setRotating] = useState(false);

  const masked = apiKey.slice(0, 11) + "•".repeat(18);

  async function rotate() {
    if (!confirm("Rotate the API key? Existing integrations using the old key will stop working.")) return;
    setRotating(true);
    const res = await fetch("/api/integrations/key", { method: "POST" });
    const data = await res.json();
    setRotating(false);
    if (data.apiKey) {
      setApiKey(data.apiKey);
      setRevealed(true);
    }
  }

  const curl = `curl -X POST ${webhookUrl} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "closing",
    "firstName": "Marcus",
    "lastName": "Reed",
    "email": "marcus@reedco.com",
    "tags": ["vip", "real-estate"],
    "date": "2026-06-04"
  }'`;

  return (
    <div className="space-y-6">
      {/* What this is */}
      <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-pine-800">Connect your CRM with Zapier</h2>
        <p className="mt-2 text-sm leading-relaxed text-pine-600/90">
          <span className="font-medium text-pine-700">Zapier</span> is a no-code tool that links your other
          apps together. You build a “Zap”: <em>when X happens in app A, do Y in app B</em> — no engineering
          required. Here, when something happens in your CRM (a deal closes, a new client is added, a birthday
          arrives), Zapier calls the Kringle webhook below, and we automatically schedule the matching gift.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["1. Trigger", "Pick a CRM event in Zapier (e.g. Follow Up Boss “deal won”)."],
            ["2. Action", "Add a “Webhooks by Zapier → POST” step pointing at the URL below."],
            ["3. Done", "Map the contact fields. Every matching event now auto-sends a gift."],
          ].map(([t, b]) => (
            <div key={t} className="rounded-xl bg-pine-50 p-3">
              <p className="text-sm font-semibold text-pine-800">{t}</p>
              <p className="mt-1 text-xs text-pine-600">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API key */}
      <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-pine-800">Your API key</h2>
        <p className="mt-1 text-sm text-pine-600/90">Send this as a Bearer token. Keep it secret.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="flex-1 truncate rounded-xl bg-ink/90 px-4 py-2.5 font-mono text-sm text-cream">
            {revealed ? apiKey : masked}
          </code>
          <button
            onClick={() => setRevealed((v) => !v)}
            className="rounded-full border border-pine-300 px-3 py-1.5 text-xs font-semibold text-pine-700 hover:bg-pine-50"
          >
            {revealed ? "Hide" : "Reveal"}
          </button>
          <CopyButton text={apiKey} />
          <button
            onClick={rotate}
            disabled={rotating}
            className="rounded-full border border-berry-400/40 px-3 py-1.5 text-xs font-semibold text-berry-500 hover:bg-berry-500/5 disabled:opacity-60"
          >
            {rotating ? "Rotating…" : "Rotate"}
          </button>
        </div>
      </div>

      {/* Webhook URL */}
      <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-pine-800">Webhook endpoint</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="flex-1 truncate rounded-xl bg-pine-50 px-4 py-2.5 font-mono text-sm text-pine-800">
            POST {webhookUrl}
          </code>
          <CopyButton text={webhookUrl} />
        </div>
        <p className="mt-3 text-sm text-pine-600/90">Supported <code>event</code> values:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(OCCASION_LABELS).map(([k, label]) => (
            <span key={k} className="rounded-full bg-parchment px-2.5 py-0.5 text-xs text-pine-700">
              <code>{k}</code> — {label}
            </span>
          ))}
        </div>
      </div>

      {/* Example */}
      <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-pine-800">Example request</h2>
          <CopyButton text={curl} />
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink/90 p-4 text-xs leading-relaxed text-cream">
          {curl}
        </pre>
        <p className="mt-3 text-xs text-pine-500">
          On success we upsert the recipient and fire any active automation whose trigger matches the event.
          Native one-click connectors for Follow Up Boss, HubSpot, and Salesforce are on the roadmap.
        </p>
      </div>
    </div>
  );
}
