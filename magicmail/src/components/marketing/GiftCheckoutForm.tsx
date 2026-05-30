"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "@/components/ui/Modal";
import { currency } from "@/lib/format";
import { OCCASION_LABELS, type OccasionType } from "@/lib/types";

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  blurb: string;
}

export function GiftCheckoutForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [giftId, setGiftId] = useState(products[0]?.id ?? "");
  const [occasion, setOccasion] = useState<OccasionType>("holiday");
  const [firstName, setFirstName] = useState("");
  const [note, setNote] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = products.find((p) => p.id === giftId);

  async function writeWithAI() {
    setAiBusy(true);
    const res = await fetch("/api/gift/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ occasion, firstName: firstName || "friend", giftId }),
    });
    const d = await res.json().catch(() => ({}));
    setAiBusy(false);
    if (d.note) setNote(d.note);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/gift/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        giftId,
        occasion,
        firstName: f.get("firstName"),
        lastName: f.get("lastName"),
        address1: f.get("address1"),
        address2: f.get("address2"),
        city: f.get("city"),
        state: f.get("state"),
        zip: f.get("zip"),
        buyerEmail: f.get("buyerEmail"),
        note,
      }),
    });
    const d = await res.json().catch(() => ({}));
    if (d.url) {
      window.location.assign(d.url);
      return;
    }
    if (d.redirect) {
      router.push(d.redirect);
      return;
    }
    setBusy(false);
    setError(d.error ?? "Something went wrong. Please try again.");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-5">
      {/* Left: gift picker */}
      <div className="lg:col-span-3 space-y-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-pine-800">1 · Choose a gift</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {products.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setGiftId(p.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  giftId === p.id ? "border-pine-600 bg-pine-50 shadow-card" : "border-pine-100 bg-white hover:border-pine-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="font-display font-semibold text-pine-800">{currency(p.price)}</span>
                </div>
                <p className="mt-2 font-medium text-pine-800">{p.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-pine-500">{p.blurb}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-pine-800">2 · Who&apos;s it for?</h2>
          <div className="mt-3 space-y-3 rounded-2xl border border-pine-100 bg-white p-5 shadow-card">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Recipient first name</label>
                <input name="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={fieldClass} placeholder="Emma" />
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <input name="lastName" required className={fieldClass} placeholder="Hollis" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Occasion</label>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value as OccasionType)} className={fieldClass}>
                {(Object.keys(OCCASION_LABELS) as OccasionType[]).map((o) => (
                  <option key={o} value={o}>{OCCASION_LABELS[o]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Mailing address</label>
              <input name="address1" required className={fieldClass} placeholder="14 Sycamore Ln" />
            </div>
            <input name="address2" className={fieldClass} placeholder="Apt, suite (optional)" />
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-3">
                <label className={labelClass}>City</label>
                <input name="city" required className={fieldClass} placeholder="Asheville" />
              </div>
              <div className="col-span-1">
                <label className={labelClass}>State</label>
                <input name="state" required maxLength={2} className={fieldClass} placeholder="NC" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>ZIP</label>
                <input name="zip" required className={fieldClass} placeholder="28801" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-pine-800">3 · Your message</h2>
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            className={`mt-3 ${fieldClass}`}
            placeholder="Add a personal message, or tap ✨ Write with AI"
          />
        </div>
      </div>

      {/* Right: summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-6 rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-pine-800">Order summary</h2>
          <div className="mt-4 flex items-center gap-3 border-b border-pine-100 pb-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-pine-50 text-2xl">{selected?.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-pine-800">{selected?.name}</p>
              <p className="text-xs text-pine-500">Handwritten · mailed in real ink</p>
            </div>
            <span className="font-display font-semibold text-pine-800">{selected ? currency(selected.price) : "—"}</span>
          </div>
          <div className="mt-4 flex items-center justify-between font-display text-lg font-semibold text-pine-800">
            <span>Total</span>
            <span>{selected ? currency(selected.price) : "—"}</span>
          </div>

          <div className="mt-5">
            <label className={labelClass}>Your email (for the receipt)</label>
            <input name="buyerEmail" type="email" required className={fieldClass} placeholder="you@example.com" />
          </div>

          {error && <p className="mt-3 rounded-xl bg-berry-500/10 px-3.5 py-2.5 text-sm text-berry-600">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-full bg-pine-700 px-5 py-3 font-semibold text-cream shadow-card transition hover:bg-pine-600 disabled:opacity-60"
          >
            {busy ? "Processing…" : selected ? `Send for ${currency(selected.price)}` : "Send"}
          </button>
          <p className="mt-3 text-center text-xs text-pine-400">No account needed · Secure checkout</p>
        </div>
      </div>
    </form>
  );
}
