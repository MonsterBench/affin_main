"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ComposeSendButton } from "@/components/dashboard/ComposeSendButton";
import { OccasionBadge, StatusBadge } from "@/components/ui/Badge";
import { shortDate } from "@/lib/format";
import type { Send, SendAction, SendStatus } from "@/lib/types";

interface Row extends Send {
  recipientName: string;
  recipientFirstName: string;
  productName: string;
  productEmoji: string;
}
interface RecipientLite {
  id: string;
  name: string;
  firstName: string;
}

const ADVANCE_LABEL: Partial<Record<SendStatus, string>> = {
  scheduled: "Start handwriting",
  handwriting: "Mark assembled",
  assembling: "Mark shipped",
  shipped: "Mark delivered",
};

export function SendsBoard({ rows, recipients }: { rows: Row[]; recipients: RecipientLite[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

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

  // One-click repeat: schedule the same gift to the same recipient again.
  async function sendAgain(s: Row) {
    setBusy(`${s.id}:again`);
    const mailDate = new Date();
    mailDate.setDate(mailDate.getDate() + 2);
    await fetch("/api/sends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientId: s.recipientId,
        giftId: s.giftId,
        occasion: s.occasion,
        scheduledFor: mailDate.toISOString().slice(0, 10),
        note: s.note,
      }),
    });
    setBusy(null);
    router.refresh();
  }

  const Pill = ({ id, action, label, primary }: { id: string; action: SendAction; label: string; primary?: boolean }) => (
    <button
      onClick={() => act(id, action)}
      disabled={busy !== null}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
        primary ? "bg-pine-700 text-cream hover:bg-pine-600" : "border border-pine-300 text-pine-700 hover:bg-pine-50"
      }`}
    >
      {busy === `${id}:${action}` ? "…" : label}
    </button>
  );

  function controls(s: Row) {
    if (s.status === "delivered")
      return (
        <div className="flex items-center gap-2">
          <span className="px-1 text-xs font-medium text-emerald-600">✓ Delivered</span>
          <button
            onClick={() => sendAgain(s)}
            disabled={busy !== null}
            className="rounded-full border border-pine-300 px-3 py-1.5 text-xs font-semibold text-pine-700 transition hover:bg-pine-50 disabled:opacity-50"
          >
            {busy === `${s.id}:again` ? "…" : "↻ Send again"}
          </button>
        </div>
      );
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
    return <Pill id={s.id} action="advance" label={ADVANCE_LABEL[s.status] ?? "Advance"} primary />;
  }

  return (
    <>
      <div className="flex justify-end">
        <ComposeSendButton recipients={recipients} label="Send a gift" />
      </div>

      {rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-pine-200 bg-white/60 p-12 text-center">
          <div className="text-4xl">🎁</div>
          <h3 className="mt-3 font-display text-lg font-semibold text-pine-800">No gifts in flight yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-pine-600/90">
            Send your first gift in under a minute — pick someone, choose a gift, and we handle the handwriting and mailing.
          </p>
          <div className="mt-5 flex justify-center">
            <ComposeSendButton recipients={recipients} label="Send your first gift" />
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {rows.map((s) => (
            <div key={s.id} className="rounded-2xl border border-pine-100 bg-white p-4 shadow-card">
              <div className="flex flex-wrap items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pine-50 text-xl">{s.productEmoji}</span>
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
      )}
    </>
  );
}
