"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/Badge";
import { shortDate } from "@/lib/format";
import type { OccasionType, SendStatus } from "@/lib/types";
import { OCCASION_LABELS } from "@/lib/types";

export interface Order {
  id: string;
  recipientName: string;
  address: string;
  addressMissing: boolean;
  gift: string;
  emoji: string;
  occasion: OccasionType;
  isLetter: boolean;
  status: SendStatus;
  scheduledFor: string;
  note: string;
}

const PROVIDER_LABEL: Record<string, string> = {
  handwrytten: "Handwrytten API",
  axidraw: "In-house AxiDraw pen",
  manual: "Operator / manual",
};

export function FulfillmentQueue({ orders, provider }: { orders: Order[]; provider: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  async function toPen(id: string) {
    setBusy(id);
    const res = await fetch(`/api/fulfillment/${id}`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (data.ok) {
      setResults((r) => ({ ...r, [id]: data.message }));
      router.refresh();
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pine-100 bg-white p-4 shadow-card">
        <div className="text-sm text-pine-600">
          Handwriting provider:{" "}
          <span className="font-semibold text-pine-800">{PROVIDER_LABEL[provider] ?? provider}</span>
          <span className="ml-2 rounded-full bg-pine-50 px-2 py-0.5 text-xs text-pine-500">
            {orders.length} open order{orders.length === 1 ? "" : "s"}
          </span>
        </div>
        <button
          onClick={() => window.location.assign("/api/fulfillment/export")}
          className="rounded-full border border-pine-300 px-4 py-2 text-sm font-semibold text-pine-700 transition hover:bg-pine-50"
        >
          ↓ Export CSV
        </button>
      </div>

      {orders.length === 0 && (
        <p className="rounded-2xl border border-pine-100 bg-white p-10 text-center text-sm text-pine-500 shadow-card">
          Nothing in the production queue right now.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {orders.map((o) => (
          <div key={o.id} className="flex flex-col rounded-2xl border border-pine-100 bg-white p-5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pine-50 text-xl">{o.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-pine-800">{o.recipientName}</p>
                <p className="text-xs text-pine-500">{o.gift} · mails {shortDate(o.scheduledFor)}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-pine-400">Ship to</span>
                {o.addressMissing ? (
                  <p className="text-berry-500">⚠ No mailing address on file</p>
                ) : (
                  <p className="text-pine-700">{o.address}</p>
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
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-parchment px-2.5 py-0.5 text-xs text-pine-700">
                {OCCASION_LABELS[o.occasion]}
              </span>
              {results[o.id] ? (
                <span className="text-xs font-medium text-emerald-600">✓ {results[o.id]}</span>
              ) : o.status === "scheduled" ? (
                <button
                  onClick={() => toPen(o.id)}
                  disabled={busy === o.id || o.addressMissing}
                  className="rounded-full bg-pine-700 px-4 py-1.5 text-xs font-semibold text-cream transition hover:bg-pine-600 disabled:opacity-50"
                  title={o.addressMissing ? "Add a mailing address first" : undefined}
                >
                  {busy === o.id ? "Sending…" : "✍️ Send to auto-pen"}
                </button>
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
