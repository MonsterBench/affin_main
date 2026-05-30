"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, fieldClass, labelClass } from "@/components/ui/Modal";
import { OccasionBadge, StatusBadge } from "@/components/ui/Badge";
import { shortDate } from "@/lib/format";
import { OCCASION_LABELS } from "@/lib/types";
import type { OccasionType, Send, SendStatus } from "@/lib/types";

interface Row extends Send {
  recipientName: string;
  productName: string;
  productEmoji: string;
}
interface Lite {
  id: string;
  name: string;
  emoji?: string;
}

const NEXT_ACTION: Partial<Record<SendStatus, string>> = {
  scheduled: "Start handwriting",
  handwriting: "Mark assembled",
  assembling: "Mark shipped",
  shipped: "Mark delivered",
};

export function SendsBoard({
  rows,
  recipients,
  products,
}: {
  rows: Row[];
  recipients: Lite[];
  products: Lite[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function advance(id: string) {
    setBusy(id);
    await fetch(`/api/sends/${id}`, { method: "PATCH" });
    setBusy(null);
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/sends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientId: f.get("recipientId"),
        giftId: f.get("giftId"),
        occasion: f.get("occasion"),
        scheduledFor: f.get("scheduledFor"),
        note: f.get("note"),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-pine-700 px-4 py-2 text-sm font-semibold text-cream shadow-card transition hover:bg-pine-600"
        >
          + New send
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map((s) => {
          const action = NEXT_ACTION[s.status];
          return (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-pine-100 bg-white p-4 shadow-card"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pine-50 text-xl">
                {s.productEmoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-pine-800">{s.recipientName}</p>
                <p className="truncate text-xs text-pine-500">
                  {s.productName} · mails {shortDate(s.scheduledFor)}
                  {s.trackingNumber ? ` · ${s.trackingNumber}` : ""}
                </p>
              </div>
              <div className="hidden sm:block">
                <OccasionBadge occasion={s.occasion} />
              </div>
              <StatusBadge status={s.status} />
              {action ? (
                <button
                  onClick={() => advance(s.id)}
                  disabled={busy === s.id}
                  className="rounded-full border border-pine-300 px-3.5 py-1.5 text-xs font-semibold text-pine-700 transition hover:bg-pine-50 disabled:opacity-50"
                >
                  {busy === s.id ? "…" : action}
                </button>
              ) : (
                <span className="px-3.5 py-1.5 text-xs font-medium text-emerald-600">✓ Complete</span>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a send">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Recipient</label>
            <select name="recipientId" required className={fieldClass} defaultValue={recipients[0]?.id}>
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Gift</label>
              <select name="giftId" required className={fieldClass} defaultValue={products[0]?.id}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Occasion</label>
              <select name="occasion" className={fieldClass} defaultValue="just_because">
                {(Object.keys(OCCASION_LABELS) as OccasionType[]).map((o) => (
                  <option key={o} value={o}>{OCCASION_LABELS[o]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Mail date</label>
            <input name="scheduledFor" type="date" required className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Handwritten note</label>
            <textarea name="note" rows={3} className={fieldClass} placeholder="Thinking of you…" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-2 text-sm font-medium text-pine-600 hover:bg-pine-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-pine-700 px-5 py-2 text-sm font-semibold text-cream transition hover:bg-pine-600 disabled:opacity-60"
            >
              {saving ? "Scheduling…" : "Schedule send"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
