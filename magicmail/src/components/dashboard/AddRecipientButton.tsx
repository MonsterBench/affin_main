"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, fieldClass, labelClass } from "@/components/ui/Modal";
import { AUDIENCE_LABELS, OCCASION_LABELS } from "@/lib/types";
import type { AudienceKind, OccasionType } from "@/lib/types";

export function AddRecipientButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const occasion = form.get("occasion") as OccasionType;
    const date = form.get("date") as string;
    const payload = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      audience: form.get("audience"),
      company: form.get("company"),
      email: form.get("email"),
      city: form.get("city"),
      state: form.get("state"),
      tags: String(form.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      importantDates: occasion && date ? [{ occasion, date }] : [],
    };
    const res = await fetch("/api/recipients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-pine-700 px-4 py-2 text-sm font-semibold text-cream shadow-card transition hover:bg-pine-600"
      >
        + Add recipient
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add a recipient">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>First name</label>
              <input name="firstName" required className={fieldClass} placeholder="Emma" />
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input name="lastName" required className={fieldClass} placeholder="Hollis" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Audience</label>
              <select name="audience" className={fieldClass} defaultValue="client">
                {(Object.keys(AUDIENCE_LABELS) as AudienceKind[]).map((a) => (
                  <option key={a} value={a}>{AUDIENCE_LABELS[a]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Company (optional)</label>
              <input name="company" className={fieldClass} placeholder="Reed & Co." />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email (optional)</label>
            <input name="email" type="email" className={fieldClass} placeholder="emma@example.com" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>City</label>
              <input name="city" className={fieldClass} placeholder="Asheville" />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input name="state" className={fieldClass} placeholder="NC" maxLength={2} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input name="tags" className={fieldClass} placeholder="vip, real-estate" />
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-pine-50 p-3">
            <div>
              <label className={labelClass}>Occasion</label>
              <select name="occasion" className={fieldClass} defaultValue="birthday">
                {(Object.keys(OCCASION_LABELS) as OccasionType[]).map((o) => (
                  <option key={o} value={o}>{OCCASION_LABELS[o]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input name="date" type="date" className={fieldClass} />
            </div>
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
              {saving ? "Saving…" : "Add recipient"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
