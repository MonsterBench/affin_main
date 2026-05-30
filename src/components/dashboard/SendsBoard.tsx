"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, fieldClass, labelClass } from "@/components/ui/Modal";
import { OccasionBadge, StatusBadge } from "@/components/ui/Badge";
import { shortDate } from "@/lib/format";
import { OCCASION_LABELS } from "@/lib/types";
import type { OccasionType, Send, SendAction, SendStatus } from "@/lib/types";

interface Row extends Send {
  recipientName: string;
  recipientFirstName: string;
  productName: string;
  productEmoji: string;
}
interface Lite {
  id: string;
  name: string;
  firstName?: string;
  emoji?: string;
}

const ADVANCE_LABEL: Partial<Record<SendStatus, string>> = {
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
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [aiBusy, setAiBusy] = useState(false);

  async function act(id: string, action: SendAction) {
    setBusy(`${id}:${action}`);
    await fetch(`/api/sends/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(null);
    router.refresh();
  }

  async function writeWithAI() {
    const f = formRef.current;
    if (!f) return;
    const fd = new FormData(f);
    const rid = String(fd.get("recipientId"));
    const recipient = recipients.find((r) => r.id === rid);
    setAiBusy(true);
    const res = await fetch("/api/ai/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        occasion: fd.get("occasion"),
        giftId: fd.get("giftId"),
        firstName: recipient?.firstName ?? recipient?.name?.split(" ")[0] ?? "friend",
      }),
    });
    const data = await res.json().catch(() => ({}));
    setAiBusy(false);
    if (data.note) setNote(data.note);
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
        note,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      setNote("");
      router.refresh();
    }
  }

  // Small pill button used for per-touch controls.
  const Pill = ({ id, action, label, primary }: { id: string; action: SendAction; label: string; primary?: boolean }) => (
    <button
      onClick={() => act(id, action)}
      disabled={busy !== null}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
        primary
          ? "bg-pine-700 text-cream hover:bg-pine-600"
          : "border border-pine-300 text-pine-700 hover:bg-pine-50"
      }`}
    >
      {busy === `${id}:${action}` ? "…" : label}
    </button>
  );

  function controls(s: Row) {
    if (s.status === "delivered") return <span className="px-2 text-xs font-medium text-emerald-600">✓ Delivered</span>;
    if (s.status === "skipped") return <span className="px-2 text-xs font-medium text-pine-400">Skipped</span>;
    if (s.status === "paused")
      return (
        <div className="flex flex-wrap gap-2">
          <Pill id={s.id} action="resume" label="Resume" primary />
          <Pill id={s.id} action="skip" label="Skip" />
        </div>
      );
    if (s.status === "scheduled")
      return (
        <div className="flex flex-wrap gap-2">
          <Pill id={s.id} action="expedite" label="Expedite" />
          <Pill id={s.id} action="delay" label="Delay" />
          <Pill id={s.id} action="pause" label="Pause" />
          <Pill id={s.id} action="skip" label="Skip" />
          <Pill id={s.id} action="advance" label={ADVANCE_LABEL.scheduled!} primary />
        </div>
      );
    // In-flight pipeline states.
    return <Pill id={s.id} action="advance" label={ADVANCE_LABEL[s.status] ?? "Advance"} primary />;
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
        {rows.map((s) => (
          <div key={s.id} className="rounded-2xl border border-pine-100 bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-center gap-4">
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
            </div>

            {s.reason && (
              <p className="mt-2 pl-[60px] text-xs text-pine-500">
                <span className="font-medium text-pine-600">Why:</span> {s.reason}
              </p>
            )}

            <div className="mt-3 flex justify-end">{controls(s)}</div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a send">
        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
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
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-pine-700">Handwritten note</label>
              <button
                type="button"
                onClick={writeWithAI}
                disabled={aiBusy}
                className="rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-600 transition hover:bg-gold-200 disabled:opacity-60"
              >
                {aiBusy ? "Writing…" : "✨ Write with AI"}
              </button>
            </div>
            <textarea
              name="note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={fieldClass}
              placeholder="Thinking of you… or tap ✨ Write with AI"
            />
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
