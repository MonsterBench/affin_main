"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OCCASION_LABELS } from "@/lib/types";

interface ActivityEvent {
  id: string;
  source: string;
  event: string;
  summary: string;
  sendsCreated: number;
  createdAt: string;
}

const SOURCE_LABEL: Record<string, string> = {
  api: "Zapier / API",
  "follow-up-boss": "Follow Up Boss",
  zapier: "Zapier",
};

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

export function IntegrationsPanel({
  apiKey: initialKey,
  webhookUrl,
  fubWebhookUrl,
  deliveryWebhookUrl,
  fubConnected: initialFub,
  events,
}: {
  apiKey: string;
  webhookUrl: string;
  fubWebhookUrl: string;
  deliveryWebhookUrl: string;
  fubConnected: boolean;
  events: ActivityEvent[];
}) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState(initialKey);
  const [revealed, setRevealed] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [fubKey, setFubKey] = useState("");
  const [fubConnected, setFubConnected] = useState(initialFub);
  const [fubBusy, setFubBusy] = useState(false);
  const [testBusy, setTestBusy] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Fire a sample event through the real webhook so the CRM integration is
  // verifiable from the UI (and shows whether an automation matched).
  async function sendTestEvent() {
    setTestBusy(true);
    setTestResult(null);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "closing",
          firstName: "Test",
          lastName: "Lead",
          email: "test.lead@example.com",
          tags: ["real-estate"],
        }),
      });
      const d = await res.json().catch(() => ({}));
      setTestResult(res.ok ? d.message ?? "Event received." : d.error ?? "Test failed.");
      if (res.ok) router.refresh(); // surface it in the activity log below
    } catch {
      setTestResult("Could not reach the webhook.");
    } finally {
      setTestBusy(false);
    }
  }

  async function saveFub(connect: boolean) {
    setFubBusy(true);
    const res = await fetch("/api/integrations/followupboss/key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fubApiKey: connect ? fubKey : "" }),
    });
    const d = await res.json().catch(() => ({}));
    setFubBusy(false);
    if (d.ok) {
      setFubConnected(d.connected);
      if (!d.connected) setFubKey("");
    }
  }

  const masked = apiKey.slice(0, 11) + "•".repeat(18);

  async function rotate() {
    if (!confirm("Rotate the API key? Existing integrations using the old key will stop working.")) return;
    setRotating(true);
    try {
      const res = await fetch("/api/integrations/key", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.apiKey) {
        setApiKey(data.apiKey);
        setRevealed(true);
      }
    } finally {
      setRotating(false);
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
          <button
            onClick={sendTestEvent}
            disabled={testBusy}
            className="rounded-full bg-pine-700 px-3 py-1 text-xs font-semibold text-cream transition hover:bg-pine-600 disabled:opacity-60"
          >
            {testBusy ? "Testing…" : "Send test event"}
          </button>
        </div>
        {testResult && (
          <p className="mt-2 rounded-xl bg-pine-50 px-3.5 py-2 text-sm text-pine-700">✓ {testResult}</p>
        )}
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
        </p>
      </div>

      {/* Follow Up Boss native connector */}
      <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-pine-800">Follow Up Boss</h2>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              fubConnected ? "bg-emerald-100 text-emerald-700" : "bg-pine-50 text-pine-500"
            }`}
          >
            {fubConnected ? "Connected" : "Not connected"}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-pine-600/90">
          Paste your Follow Up Boss API key so we can read contact details when an event fires
          (closings → closing gift, new leads → welcome). Then add the webhook URL below in FUB under
          <span className="font-medium"> Admin → Integrations → Webhooks</span>.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="password"
            value={fubKey}
            onChange={(e) => setFubKey(e.target.value)}
            placeholder={fubConnected ? "•••••••• (saved)" : "FUB API key"}
            className="flex-1 rounded-xl border border-pine-200 bg-cream/40 px-3.5 py-2.5 text-sm focus:border-pine-500 focus:bg-white focus:outline-none"
          />
          {fubConnected ? (
            <button
              onClick={() => saveFub(false)}
              disabled={fubBusy}
              className="rounded-full border border-berry-400/40 px-4 py-2 text-sm font-semibold text-berry-500 hover:bg-berry-500/5 disabled:opacity-60"
            >
              {fubBusy ? "…" : "Disconnect"}
            </button>
          ) : (
            <button
              onClick={() => saveFub(true)}
              disabled={fubBusy || !fubKey}
              className="rounded-full bg-pine-700 px-4 py-2 text-sm font-semibold text-cream hover:bg-pine-600 disabled:opacity-60"
            >
              {fubBusy ? "…" : "Connect"}
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="flex-1 truncate rounded-xl bg-pine-50 px-4 py-2.5 font-mono text-xs text-pine-800">
            {fubWebhookUrl}
          </code>
          <CopyButton text={fubWebhookUrl} />
        </div>
      </div>

      {/* Delivery webhook */}
      <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-pine-800">Delivery status webhook</h2>
        <p className="mt-2 text-sm leading-relaxed text-pine-600/90">
          Point your handwriting/shipping provider here to push tracking updates. We&apos;ll mark
          the send <code>shipped</code> or <code>delivered</code> and email you on delivery.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="flex-1 truncate rounded-xl bg-pine-50 px-4 py-2.5 font-mono text-xs text-pine-800">
            POST {deliveryWebhookUrl}
          </code>
          <CopyButton text={deliveryWebhookUrl} />
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink/90 p-4 text-xs leading-relaxed text-cream">
{`{ "sendId": "...", "status": "delivered", "trackingNumber": "9400 ..." }`}
        </pre>
      </div>

      {/* Activity log */}
      <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-pine-800">Recent activity</h2>
        <p className="mt-1 text-sm text-pine-600/90">The latest events received from your CRM and webhooks.</p>
        {events.length === 0 ? (
          <p className="mt-4 rounded-xl bg-pine-50 px-3.5 py-3 text-sm text-pine-500">
            No events yet. Use “Send test event” above to see one appear here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-pine-50">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2.5">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${e.sendsCreated > 0 ? "bg-emerald-500" : "bg-pine-200"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-pine-800">{e.summary}</p>
                  <p className="text-xs text-pine-500">
                    {SOURCE_LABEL[e.source] ?? e.source} · {OCCASION_LABELS[e.event as keyof typeof OCCASION_LABELS] ?? e.event}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-pine-400">
                  {new Date(e.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
