"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fieldClass, labelClass } from "@/components/ui/Modal";
import { LETTER_STYLES, DEFAULT_STYLE_ID, getLetterStyle } from "@/lib/letterStyles";

type Phase = "details" | "review" | "send";

export function SantaLetterCreator() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("details");

  // Child details.
  const [d, setD] = useState({
    childName: "",
    age: "",
    hometown: "",
    interests: "",
    goodDeed: "",
    wishItem: "",
    petName: "",
    sibling: "",
  });
  const set = (k: keyof typeof d) => (e: React.ChangeEvent<HTMLInputElement>) => setD({ ...d, [k]: e.target.value });

  const [letter, setLetter] = useState("");
  const [styleId, setStyleId] = useState(DEFAULT_STYLE_ID);
  const [soundsHuman, setSoundsHuman] = useState(true);
  const [gen, setGen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send details.
  const [s, setS] = useState({ lastName: "", address1: "", city: "", state: "", zip: "", buyerEmail: "" });
  const setSend = (k: keyof typeof s) => (e: React.ChangeEvent<HTMLInputElement>) => setS({ ...s, [k]: e.target.value });
  const [sending, setSending] = useState(false);

  async function generate() {
    if (!d.childName.trim()) return setError("Please add the child's name.");
    setError(null);
    setGen(true);
    try {
      const res = await fetch("/api/ai/santa-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      const data = await res.json().catch(() => ({}));
      if (data.letter) {
        setLetter(data.letter);
        setSoundsHuman(data.soundsHuman);
        setPhase("review");
      } else {
        setError(data.error ?? "Could not write the letter. Please try again.");
      }
    } finally {
      setGen(false);
    }
  }

  async function checkout() {
    if (!s.lastName || !s.address1 || !s.city || !s.state || !s.zip) return setError("Please complete the mailing address.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.buyerEmail)) return setError("Please enter a valid email.");
    setError(null);
    setSending(true);
    const res = await fetch("/api/gift/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        giftId: "santa-letter-deluxe",
        occasion: "holiday",
        firstName: d.childName,
        lastName: s.lastName,
        address1: s.address1,
        city: s.city,
        state: s.state,
        zip: s.zip,
        buyerEmail: s.buyerEmail,
        note: letter,
        styleId,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.url) return window.location.assign(data.url);
    if (data.redirect) return router.push(data.redirect);
    setSending(false);
    setError(data.error ?? "Checkout failed. Please try again.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left: inputs */}
      <div>
        {phase === "details" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-pine-800">Tell Santa about your child</h2>
            <p className="text-sm text-pine-600/90">The more you share, the more magical and personal the letter. Only the name is required.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Child&apos;s first name *</label>
                <input className={fieldClass} value={d.childName} onChange={set("childName")} placeholder="Emma" />
              </div>
              <div>
                <label className={labelClass}>Age</label>
                <input className={fieldClass} value={d.age} onChange={set("age")} placeholder="6" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Hometown</label>
              <input className={fieldClass} value={d.hometown} onChange={set("hometown")} placeholder="Asheville" />
            </div>
            <div>
              <label className={labelClass}>What do they love?</label>
              <input className={fieldClass} value={d.interests} onChange={set("interests")} placeholder="dinosaurs and soccer" />
            </div>
            <div>
              <label className={labelClass}>A kind or brave thing they did this year</label>
              <input className={fieldClass} value={d.goodDeed} onChange={set("goodDeed")} placeholder="helped your little brother learn to ride his bike" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Hoping for</label>
                <input className={fieldClass} value={d.wishItem} onChange={set("wishItem")} placeholder="a telescope" />
              </div>
              <div>
                <label className={labelClass}>Pet&apos;s name</label>
                <input className={fieldClass} value={d.petName} onChange={set("petName")} placeholder="Biscuit" />
              </div>
            </div>
            <div>
              <label className={labelClass}>A sibling or friend to greet</label>
              <input className={fieldClass} value={d.sibling} onChange={set("sibling")} placeholder="Noah" />
            </div>
            {error && <p className="rounded-xl bg-berry-500/10 px-3.5 py-2.5 text-sm text-berry-600">{error}</p>}
            <button
              onClick={generate}
              disabled={gen}
              className="w-full rounded-full bg-pine-700 px-5 py-3 font-semibold text-cream shadow-card transition hover:bg-pine-600 disabled:opacity-60"
            >
              {gen ? "Santa is writing…" : `✨ Write ${d.childName || "the"}${d.childName ? "’s" : ""} letter from Santa`}
            </button>
          </div>
        )}

        {phase === "send" && (
          <div className="space-y-4">
            <button onClick={() => setPhase("review")} className="text-sm font-semibold text-pine-600 hover:underline">← Back to the letter</button>
            <h2 className="font-display text-xl font-semibold text-pine-800">Where should Santa mail it?</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Child&apos;s first name</label>
                <input className={`${fieldClass} bg-pine-50`} value={d.childName} readOnly />
              </div>
              <div>
                <label className={labelClass}>Last name *</label>
                <input className={fieldClass} value={s.lastName} onChange={setSend("lastName")} placeholder="Hollis" />
              </div>
            </div>
            <input className={fieldClass} value={s.address1} onChange={setSend("address1")} placeholder="Street address" />
            <div className="grid grid-cols-6 gap-3">
              <input className={`${fieldClass} col-span-3`} value={s.city} onChange={setSend("city")} placeholder="City" />
              <input className={`${fieldClass} col-span-1`} maxLength={2} value={s.state} onChange={setSend("state")} placeholder="ST" />
              <input className={`${fieldClass} col-span-2`} value={s.zip} onChange={setSend("zip")} placeholder="ZIP" />
            </div>
            <div>
              <label className={labelClass}>Your email (for the receipt)</label>
              <input className={fieldClass} value={s.buyerEmail} onChange={setSend("buyerEmail")} placeholder="you@example.com" />
            </div>
            {error && <p className="rounded-xl bg-berry-500/10 px-3.5 py-2.5 text-sm text-berry-600">{error}</p>}
            <button
              onClick={checkout}
              disabled={sending}
              className="w-full rounded-full bg-pine-700 px-5 py-3 font-semibold text-cream shadow-card transition hover:bg-pine-600 disabled:opacity-60"
            >
              {sending ? "Processing…" : "🎅 Send the Deluxe Santa Letter — $49"}
            </button>
            <p className="text-center text-xs text-pine-400">Hand-penned in real ink · North Pole postmark · no account needed</p>
          </div>
        )}
      </div>

      {/* Right: live letter preview */}
      <div>
        <div className="sticky top-6">
          {phase === "details" ? (
            <div className="grid h-full min-h-[320px] place-items-center rounded-3xl border border-dashed border-gold-300/60 bg-parchment/60 p-8 text-center">
              <p className="max-w-xs text-pine-500">✉️ Your child&apos;s personalized letter from Santa will appear here.</p>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <p className="mb-2 text-left text-xs font-semibold uppercase tracking-wide text-pine-500">Letter style</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {LETTER_STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStyleId(st.id)}
                      title={st.blurb}
                      className={`w-20 shrink-0 rounded-xl border p-1.5 text-center transition ${
                        styleId === st.id ? "border-pine-600 ring-1 ring-pine-500/30" : "border-pine-200 hover:border-pine-400"
                      }`}
                    >
                      <span className="block h-9 w-full rounded-md border border-black/10" style={{ background: st.paper }} />
                      <span className="mt-1 block text-[10px] font-medium leading-tight text-pine-700">{st.emoji} {st.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative rounded-3xl border border-gold-300/40 p-7 shadow-lift" style={{ background: getLetterStyle(styleId).paper }}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-berry-500">North Pole · Santa&apos;s Workshop</span>
                  <span className="text-xl">❄️</span>
                </div>
                <p className="whitespace-pre-line font-display text-[15px] leading-relaxed" style={{ color: getLetterStyle(styleId).ink }}>{letter}</p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    soundsHuman ? "bg-emerald-100 text-emerald-700" : "bg-gold-100 text-gold-600"
                  }`}
                >
                  {soundsHuman ? "✓ Reads like a real letter from Santa" : "✓ Polished to sound human"}
                </span>
                <button onClick={generate} disabled={gen} className="text-sm font-semibold text-pine-600 hover:underline disabled:opacity-60">
                  {gen ? "Rewriting…" : "↻ Rewrite"}
                </button>
              </div>

              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                rows={4}
                className={`mt-3 ${fieldClass}`}
                aria-label="Edit the letter"
              />

              {phase === "review" && (
                <button
                  onClick={() => setPhase("send")}
                  className="mt-3 w-full rounded-full bg-gold-300 px-5 py-3 font-semibold text-pine-900 transition hover:bg-gold-200"
                >
                  Looks magical — send it 🎄
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
