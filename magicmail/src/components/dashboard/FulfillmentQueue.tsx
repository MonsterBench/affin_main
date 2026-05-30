"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/Badge";
import { shortDate } from "@/lib/format";
import type { OccasionType, SendStatus } from "@/lib/types";
import { OCCASION_LABELS } from "@/lib/types";

export interface Order {
  id: string;
  recipientName: string;
  address: string;
  addressOk: boolean;
  addressIssue?: string;
  gift: string;
  emoji: string;
  occasion: OccasionType;
  isLetter: boolean;
  status: SendStatus;
  scheduledFor: string;
  note: string;
  magicToken?: string;
  fulfillProvider?: string;
  fulfillStatus?: string;
  fulfillJobId?: string;
}

const PROVIDER_NAME: Record<string, string> = {
  handwrytten: "Handwrytten",
  axidraw: "In-house pen",
  manual: "Operator",
};

const PROVIDER_LABEL: Record<string, string> = {
  handwrytten: "Handwrytten API",
  axidraw: "In-house AxiDraw pen",
  manual: "Operator / manual",
};

type Filter = "all" | "scheduled" | "production";

export function FulfillmentQueue({ orders, provider }: { orders: Order[]; provider: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>("all");
  const [banner, setBanner] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [polling, setPolling] = useState(false);

  const counts = useMemo(
    () => ({
      all: orders.length,
      scheduled: orders.filter((o) => o.status === "scheduled").length,
      production: orders.filter((o) => o.status !== "scheduled").length,
    }),
    [orders],
  );
  const readyCount = orders.filter((o) => o.status === "scheduled" && o.addressOk).length;

  const shown = orders.filter((o) =>
    filter === "all" ? true : filter === "scheduled" ? o.status === "scheduled" : o.status !== "scheduled",
  );

  async function toPen(id: string) {
    setBusy(id);
    setErrors((e) => ({ ...e, [id]: "" }));
    try {
      const res = await fetch(`/api/fulfillment/${id}`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        setResults((r) => ({ ...r, [id]: data.message }));
        router.refresh();
      } else {
        setErrors((e) => ({ ...e, [id]: data.error ?? "Could not send." }));
      }
    } finally {
      setBusy(null);
    }
  }

  async function sendAllReady() {
    setBulkBusy(true);
    setBanner(null);
    try {
      const res = await fetch("/api/fulfillment/bulk", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        setBanner(`Sent ${data.sent} to the auto-pen${data.skipped ? ` · ${data.skipped} skipped (address needs fixing)` : ""}.`);
        router.refresh();
      }
    } finally {
      setBulkBusy(false);
    }
  }

  async function testConnection() {
    setTesting(true);
    setBanner(null);
    try {
      const res = await fetch("/api/handwriting/test", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setBanner((data.ok ? "✓ " : "⚠️ ") + (data.message ?? "Connection test complete."));
    } finally {
      setTesting(false);
    }
  }

  async function refreshStatus() {
    setPolling(true);
    setBanner(null);
    try {
      const res = await fetch("/api/fulfillment/poll", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        setBanner(`Checked ${data.checked} order${data.checked === 1 ? "" : "s"} · ${data.updated} updated.`);
        router.refresh();
      }
    } finally {
      setPolling(false);
    }
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "scheduled", label: "Scheduled" },
    { id: "production", label: "In production" },
  ];

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pine-100 bg-white p-4 shadow-card">
        <div className="text-sm text-pine-600">
          Handwriting provider:{" "}
          <span className="font-semibold text-pine-800">{PROVIDER_LABEL[provider] ?? provider}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={sendAllReady}
            disabled={bulkBusy || readyCount === 0}
            className="rounded-full bg-pine-700 px-4 py-2 text-sm font-semibold text-cream transition hover:bg-pine-600 disabled:opacity-50"
          >
            {bulkBusy ? "Sending…" : `✍️ Send all ready (${readyCount})`}
          </button>
          <button
            onClick={refreshStatus}
            disabled={polling}
            className="rounded-full border border-pine-300 px-4 py-2 text-sm font-semibold text-pine-700 transition hover:bg-pine-50 disabled:opacity-50"
          >
            {polling ? "Refreshing…" : "↻ Refresh status"}
          </button>
          <button
            onClick={testConnection}
            disabled={testing}
            className="rounded-full border border-pine-300 px-4 py-2 text-sm font-semibold text-pine-700 transition hover:bg-pine-50 disabled:opacity-50"
          >
            {testing ? "Testing…" : "Test connection"}
          </button>
          <button
            onClick={() => window.location.assign("/api/fulfillment/export")}
            className="rounded-full border border-pine-300 px-4 py-2 text-sm font-semibold text-pine-700 transition hover:bg-pine-50"
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      {banner && (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{banner}</p>
      )}

      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              filter === t.id ? "bg-pine-700 text-cream" : "bg-pine-50 text-pine-700 hover:bg-pine-100"
            }`}
          >
            {t.label} <span className="opacity-70">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="rounded-2xl border border-pine-100 bg-white p-10 text-center text-sm text-pine-500 shadow-card">
          Nothing here right now.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((o) => (
          <div key={o.id} className="flex flex-col rounded-2xl border border-pine-100 bg-white p-5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pine-50 text-xl">{o.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-pine-800">{o.recipientName}</p>
                <p className="text-xs text-pine-500">{o.gift} · mails {shortDate(o.scheduledFor)}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>

            {o.fulfillProvider && (
              <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-pine-50 px-3 py-2 text-xs">
                <span className="font-semibold text-pine-700">
                  📮 Dispatched to {PROVIDER_NAME[o.fulfillProvider] ?? o.fulfillProvider}
                </span>
                {o.fulfillStatus && (
                  <span className="rounded-full bg-white px-2 py-0.5 font-medium text-pine-600">{o.fulfillStatus}</span>
                )}
                {o.fulfillJobId && <span className="text-pine-400">job {o.fulfillJobId}</span>}
              </div>
            )}

            <div className="mt-3 space-y-2 text-sm">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-pine-400">Ship to</span>
                {o.addressOk ? (
                  <p className="text-pine-700">{o.address}</p>
                ) : (
                  <p className="text-berry-500">⚠ {o.addressIssue ?? "Address needs fixing"}</p>
                )}
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-pine-400">
                  Note ({o.isLetter ? "Santa script" : "casual script"})
                </span>
                <p className="mt-0.5 whitespace-pre-line rounded-xl bg-cream/70 p-3 font-display text-sm italic leading-relaxed text-pine-700">
                  {o.note || "— no note —"}
                </p>
              </div>
              {o.magicToken && (
                <div className="flex items-center gap-3 rounded-xl border border-gold-200 bg-gold-100/40 p-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/magic/${o.magicToken}/qr`} alt="Magic QR" className="h-14 w-14 rounded bg-white p-1" />
                  <div className="text-xs text-pine-700">
                    <p className="font-semibold">✨ Print this QR on the letter</p>
                    <p className="text-pine-500">Scans to the child&apos;s personalized Santa video.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-parchment px-2.5 py-0.5 text-xs text-pine-700">
                {OCCASION_LABELS[o.occasion]}
              </span>
              {results[o.id] ? (
                <span className="text-xs font-medium text-emerald-600">✓ {results[o.id]}</span>
              ) : o.status === "scheduled" ? (
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => toPen(o.id)}
                    disabled={busy === o.id || !o.addressOk}
                    className="rounded-full bg-pine-700 px-4 py-1.5 text-xs font-semibold text-cream transition hover:bg-pine-600 disabled:opacity-50"
                    title={!o.addressOk ? "Fix the mailing address first" : undefined}
                  >
                    {busy === o.id ? "Sending…" : "✍️ Send to auto-pen"}
                  </button>
                  {errors[o.id] && <span className="text-xs text-berry-500">{errors[o.id]}</span>}
                </div>
              ) : (
                <span className="text-xs font-medium text-gold-600">In production</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
