"use client";

import { useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-pine-900/40 backdrop-blur-sm"
      />
      <div className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-lift sm:max-w-lg sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-pine-800">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-pine-500 transition hover:bg-pine-50"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Shared field styles so every form in the app looks identical.
export const fieldClass =
  "w-full rounded-xl border border-pine-200 bg-cream/40 px-3.5 py-2.5 text-sm text-pine-800 placeholder:text-pine-400 focus:border-pine-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-500/20";
export const labelClass = "block text-sm font-medium text-pine-700 mb-1.5";
