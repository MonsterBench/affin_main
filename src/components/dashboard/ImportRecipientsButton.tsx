"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, fieldClass, labelClass } from "@/components/ui/Modal";

type Tab = "csv" | "ics" | "url";

export function ImportRecipientsButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("csv");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  function reset() {
    setContent("");
    setFileName("");
    setUrl("");
    setError(null);
    setResult(null);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setContent(await f.text());
  }

  async function submit() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const body = tab === "url" ? { kind: "url", url } : { kind: tab, content };
      const res = await fetch("/api/recipients/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json().catch(() => ({}));
      if (d.ok) {
        setResult(
          `Imported ${d.created} new, updated ${d.merged}, added ${d.datesAdded} date${d.datesAdded === 1 ? "" : "s"}` +
            (d.skipped ? ` · ${d.skipped} skipped` : "") + ".",
        );
        router.refresh();
      } else {
        setError(d.error ?? "Import failed.");
      }
    } finally {
      setBusy(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "csv", label: "Spreadsheet (CSV)" },
    { id: "ics", label: "Calendar file (.ics)" },
    { id: "url", label: "Calendar URL" },
  ];

  return (
    <>
      <button
        onClick={() => { reset(); setOpen(true); }}
        className="rounded-full border border-pine-300 px-4 py-2 text-sm font-semibold text-pine-700 transition hover:bg-pine-50"
      >
        ↑ Import
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Import recipients & dates">
        <div className="mb-4 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); reset(); }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                tab === t.id ? "bg-pine-700 text-cream" : "bg-pine-50 text-pine-700 hover:bg-pine-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "csv" && (
          <div className="space-y-2">
            <label className={labelClass}>Upload a spreadsheet</label>
            <input type="file" accept=".csv,text/csv" onChange={onFile} className="block w-full text-sm text-pine-700 file:mr-3 file:rounded-full file:border-0 file:bg-pine-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pine-700" />
            <p className="text-xs text-pine-500">
              Columns we read: name (or first/last), email, company, address, city, state, zip, <b>birthday</b>, <b>anniversary</b>.
            </p>
          </div>
        )}

        {tab === "ics" && (
          <div className="space-y-2">
            <label className={labelClass}>Upload a calendar export (.ics)</label>
            <input type="file" accept=".ics,text/calendar" onChange={onFile} className="block w-full text-sm text-pine-700 file:mr-3 file:rounded-full file:border-0 file:bg-pine-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pine-700" />
            <p className="text-xs text-pine-500">
              From Google/Apple/Outlook: export or download your calendar as <code>.ics</code>. We pull out birthday & anniversary events.
            </p>
          </div>
        )}

        {tab === "url" && (
          <div className="space-y-2">
            <label className={labelClass}>Calendar feed URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className={fieldClass} placeholder="https://calendar.google.com/…/basic.ics" />
            <p className="text-xs text-pine-500">
              Paste a public/shareable <code>.ics</code> (or <code>webcal://</code>) link. We import birthday & anniversary events from it.
            </p>
          </div>
        )}

        {fileName && <p className="mt-2 text-xs text-pine-500">Selected: {fileName}</p>}
        {error && <p className="mt-3 rounded-xl bg-berry-500/10 px-3.5 py-2.5 text-sm text-berry-600">{error}</p>}
        {result && <p className="mt-3 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">✓ {result}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setOpen(false)} className="rounded-full px-4 py-2 text-sm font-medium text-pine-600 hover:bg-pine-50">
            Close
          </button>
          <button
            onClick={submit}
            disabled={busy || (tab === "url" ? !url : !content)}
            className="rounded-full bg-pine-700 px-5 py-2 text-sm font-semibold text-cream transition hover:bg-pine-600 disabled:opacity-50"
          >
            {busy ? "Importing…" : "Import"}
          </button>
        </div>
      </Modal>
    </>
  );
}
