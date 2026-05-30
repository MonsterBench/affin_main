"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, fieldClass, labelClass } from "@/components/ui/Modal";
import { CATALOG } from "@/lib/catalog";
import { currency, initials } from "@/lib/format";
import { OCCASION_LABELS, type OccasionType } from "@/lib/types";

interface RecipientLite {
  id: string;
  name: string;
  firstName: string;
}

// One unified, guided "send a gift" flow: pick (or add) a recipient, choose a
// gift visually, write a note (AI-assisted), and schedule — all in one place.
export interface ComposePreset {
  recipientId?: string;
  occasion?: OccasionType;
  giftId?: string;
}

export function ComposeSendButton({
  recipients,
  label = "Send a gift",
  variant = "primary",
  className = "",
  preset,
}: {
  recipients: RecipientLite[];
  label?: string;
  variant?: "primary" | "ghost";
  className?: string;
  preset?: ComposePreset;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const base = "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition";
  const trigger =
    variant === "primary"
      ? `${base} bg-pine-700 text-cream shadow-card hover:bg-pine-600`
      : `${base} border border-pine-300 text-pine-700 hover:bg-pine-50`;

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${trigger} ${className}`}>
        🎁 {label}
      </button>
      {open && (
        <ComposeModal
          recipients={recipients}
          preset={preset}
          onClose={() => setOpen(false)}
          onDone={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function ComposeModal({
  recipients,
  preset,
  onClose,
  onDone,
}: {
  recipients: RecipientLite[];
  preset?: ComposePreset;
  onClose: () => void;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"existing" | "new">(recipients.length ? "existing" : "new");
  const [search, setSearch] = useState("");
  const presetRecipient = preset?.recipientId && recipients.some((r) => r.id === preset.recipientId)
    ? preset.recipientId
    : recipients[0]?.id;
  const [selected, setSelected] = useState<string[]>(presetRecipient ? [presetRecipient] : []);
  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  // New-recipient fields.
  const [nr, setNr] = useState({ firstName: "", lastName: "", address1: "", city: "", state: "", zip: "" });

  const [giftId, setGiftId] = useState(
    preset?.giftId && CATALOG.some((p) => p.id === preset.giftId)
      ? preset.giftId
      : CATALOG.find((p) => p.popular)?.id ?? CATALOG[0].id,
  );
  const [occasion, setOccasion] = useState<OccasionType>(preset?.occasion ?? "just_because");
  const [scheduledFor, setScheduledFor] = useState(todayPlus(2));
  const [note, setNote] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () => recipients.filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase())),
    [recipients, search],
  );
  const selectedGift = CATALOG.find((p) => p.id === giftId)!;
  const firstName = mode === "new" ? nr.firstName : recipients.find((r) => r.id === selected[0])?.firstName ?? "";

  async function writeWithAI() {
    setAiBusy(true);
    try {
      const res = await fetch("/api/ai/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, giftId, firstName: firstName || "friend" }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.note) setNote(data.note);
    } finally {
      setAiBusy(false);
    }
  }

  async function submit() {
    setError(null);

    if (mode === "new") {
      if (!nr.firstName || !nr.lastName) return setError("Enter the recipient's name.");
      if (!nr.address1 || !nr.city || !nr.state || !nr.zip) return setError("A full mailing address is required.");
    } else if (selected.length === 0) {
      return setError("Choose at least one recipient.");
    }

    setSaving(true);
    try {
      if (mode === "new") {
        // Create the new recipient inline, then schedule the gift.
        const res = await fetch("/api/recipients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...nr, audience: "client", importantDates: occasion && scheduledFor ? [{ occasion, date: scheduledFor }] : [] }),
        });
        if (!res.ok) throw new Error("Could not save the recipient.");
        const newId = (await res.json()).id;
        const send = await fetch("/api/sends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientId: newId, giftId, occasion, scheduledFor, note }),
        });
        if (!send.ok) throw new Error("Could not schedule the gift.");
      } else {
        // Bulk endpoint handles one or many recipients.
        const res = await fetch("/api/sends/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientIds: selected, giftId, occasion, scheduledFor, note }),
        });
        if (!res.ok) throw new Error("Could not schedule the gifts.");
      }
      onDone();
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <Modal open onClose={onClose} title="Send a gift">
      <div className="space-y-6">
        {/* 1. Recipient */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-pine-800">
              1 · Who is it for?
              {mode === "existing" && selected.length > 0 && (
                <span className="ml-2 font-normal text-pine-500">{selected.length} selected</span>
              )}
            </h3>
            <button
              onClick={() => setMode(mode === "existing" ? "new" : "existing")}
              className="text-xs font-semibold text-pine-600 hover:underline"
            >
              {mode === "existing" ? "+ Send to someone new" : "← Pick from my list"}
            </button>
          </div>

          {mode === "existing" ? (
            <div>
              {recipients.length > 6 && (
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search recipients…"
                  className={`${fieldClass} mb-2`}
                />
              )}
              <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {filtered.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => toggle(r.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      selected.includes(r.id) ? "border-pine-600 bg-pine-50" : "border-pine-100 hover:bg-cream/60"
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pine-100 text-xs font-semibold text-pine-700">
                      {initials(r.name.split(" ")[0] ?? "", r.name.split(" ")[1] ?? "")}
                    </span>
                    <span className="truncate text-sm text-pine-800">{r.name}</span>
                    {selected.includes(r.id) && <span className="ml-auto text-pine-600">✓</span>}
                  </button>
                ))}
                {filtered.length === 0 && <p className="px-1 py-3 text-sm text-pine-400">No matches.</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input className={fieldClass} placeholder="First name" value={nr.firstName} onChange={(e) => setNr({ ...nr, firstName: e.target.value })} />
                <input className={fieldClass} placeholder="Last name" value={nr.lastName} onChange={(e) => setNr({ ...nr, lastName: e.target.value })} />
              </div>
              <input className={fieldClass} placeholder="Street address" value={nr.address1} onChange={(e) => setNr({ ...nr, address1: e.target.value })} />
              <div className="grid grid-cols-6 gap-3">
                <input className={`${fieldClass} col-span-3`} placeholder="City" value={nr.city} onChange={(e) => setNr({ ...nr, city: e.target.value })} />
                <input className={`${fieldClass} col-span-1`} placeholder="ST" maxLength={2} value={nr.state} onChange={(e) => setNr({ ...nr, state: e.target.value })} />
                <input className={`${fieldClass} col-span-2`} placeholder="ZIP" value={nr.zip} onChange={(e) => setNr({ ...nr, zip: e.target.value })} />
              </div>
            </div>
          )}
        </section>

        {/* 2. Gift */}
        <section>
          <h3 className="mb-2 text-sm font-semibold text-pine-800">2 · Pick a gift</h3>
          <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
            {CATALOG.map((p) => (
              <button
                key={p.id}
                onClick={() => setGiftId(p.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  giftId === p.id ? "border-pine-600 bg-pine-50 ring-1 ring-pine-500/20" : "border-pine-100 hover:border-pine-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-xs font-semibold text-pine-700">{currency(p.price)}</span>
                </div>
                <p className="mt-1.5 text-xs font-medium leading-tight text-pine-800">{p.name}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 3. When + message */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-pine-800">3 · Occasion, date & message</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Occasion</label>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value as OccasionType)} className={fieldClass}>
                {(Object.keys(OCCASION_LABELS) as OccasionType[]).map((o) => (
                  <option key={o} value={o}>{OCCASION_LABELS[o]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Mail date</label>
              <input type="date" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} className={fieldClass} />
            </div>
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
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className={fieldClass} placeholder="Add a personal note, or tap ✨ Write with AI" />
          </div>
        </section>

        {error && <p className="rounded-xl bg-berry-500/10 px-3.5 py-2.5 text-sm text-berry-600">{error}</p>}

        {/* Sticky-ish footer summary + CTA */}
        <div className="flex items-center justify-between gap-3 border-t border-pine-100 pt-4">
          <span className="text-sm text-pine-600">
            {selectedGift.emoji} {selectedGift.name} · <span className="font-semibold text-pine-800">{currency(selectedGift.price)}</span>
          </span>
          <div className="flex gap-3">
            <button onClick={onClose} className="rounded-full px-4 py-2 text-sm font-medium text-pine-600 hover:bg-pine-50">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="rounded-full bg-pine-700 px-5 py-2 text-sm font-semibold text-cream transition hover:bg-pine-600 disabled:opacity-60"
            >
              {saving
                ? "Scheduling…"
                : mode === "existing" && selected.length > 1
                  ? `Schedule ${selected.length} gifts`
                  : "Schedule gift"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
