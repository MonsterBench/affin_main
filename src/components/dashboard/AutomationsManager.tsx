"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, fieldClass, labelClass } from "@/components/ui/Modal";
import { OccasionBadge } from "@/components/ui/Badge";
import { AUDIENCE_LABELS, CADENCE_LABELS, OCCASION_LABELS } from "@/lib/types";
import type { Automation, AudienceKind, Cadence, OccasionType } from "@/lib/types";

interface ProductLite {
  id: string;
  name: string;
  emoji: string;
}

export function AutomationsManager({
  automations,
  products,
}: {
  automations: Automation[];
  products: ProductLite[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const productName = (id: string) => products.find((p) => p.id === id);

  async function toggle(id: string) {
    setBusy(id);
    await fetch(`/api/automations/${id}`, { method: "PATCH" });
    setBusy(null);
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        triggerOccasion: f.get("triggerOccasion"),
        giftId: f.get("giftId"),
        leadTimeDays: Number(f.get("leadTimeDays")),
        audienceFilter: f.get("audienceFilter"),
        tagFilter: f.get("tagFilter") || undefined,
        cadence: f.get("cadence"),
        noteTemplate: f.get("noteTemplate"),
        active: true,
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
          + New automation
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {automations.map((a) => {
          const product = productName(a.giftId);
          return (
            <div
              key={a.id}
              className={`rounded-2xl border p-5 shadow-card transition ${
                a.active ? "border-pine-200 bg-white" : "border-pine-100 bg-cream/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-pine-50 text-xl">
                    {product?.emoji ?? "🎁"}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-pine-800">{a.name}</h3>
                    <p className="text-xs text-pine-500">{product?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(a.id)}
                  disabled={busy === a.id}
                  role="switch"
                  aria-checked={a.active}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    a.active ? "bg-pine-600" : "bg-pine-200"
                  } disabled:opacity-50`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      a.active ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <OccasionBadge occasion={a.triggerOccasion} />
                <span className="rounded-full bg-parchment px-2.5 py-0.5 text-xs text-pine-700">
                  {a.audienceFilter === "all" ? "Everyone" : AUDIENCE_LABELS[a.audienceFilter]}
                  {a.tagFilter ? ` · #${a.tagFilter}` : ""}
                </span>
                <span className="rounded-full bg-parchment px-2.5 py-0.5 text-xs text-pine-700">
                  {a.leadTimeDays}d lead time
                </span>
                {a.cadence !== "one_time" && (
                  <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-600">
                    🔁 {CADENCE_LABELS[a.cadence]}
                  </span>
                )}
              </div>
              <p className="mt-3 rounded-xl bg-cream/70 p-3 text-xs italic leading-relaxed text-pine-600">
                “{a.noteTemplate}”
              </p>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New automation">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input name="name" required className={fieldClass} placeholder="VIP client birthdays" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Trigger</label>
              <select name="triggerOccasion" className={fieldClass} defaultValue="birthday">
                {(Object.keys(OCCASION_LABELS) as OccasionType[]).map((o) => (
                  <option key={o} value={o}>{OCCASION_LABELS[o]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Gift</label>
              <select name="giftId" className={fieldClass} defaultValue={products[0]?.id}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Audience</label>
              <select name="audienceFilter" className={fieldClass} defaultValue="all">
                <option value="all">Everyone</option>
                {(Object.keys(AUDIENCE_LABELS) as AudienceKind[]).map((a) => (
                  <option key={a} value={a}>{AUDIENCE_LABELS[a]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tag filter</label>
              <input name="tagFilter" className={fieldClass} placeholder="vip" />
            </div>
            <div>
              <label className={labelClass}>Lead days</label>
              <input name="leadTimeDays" type="number" min={0} max={60} defaultValue={5} className={fieldClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Cadence</label>
            <select name="cadence" className={fieldClass} defaultValue="one_time">
              {(Object.keys(CADENCE_LABELS) as Cadence[]).map((c) => (
                <option key={c} value={c}>
                  {CADENCE_LABELS[c]}{c === "quarterly" ? " — “Top of Mind”" : ""}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-pine-500">
              Recurring cadences keep sending on a schedule (like a quarterly Top-of-Mind program).
            </p>
          </div>
          <div>
            <label className={labelClass}>Note template</label>
            <textarea
              name="noteTemplate"
              rows={3}
              className={fieldClass}
              placeholder="Happy birthday, {firstName}! Hope your day is wonderful."
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
              {saving ? "Creating…" : "Create automation"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
