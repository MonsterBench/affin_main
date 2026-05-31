import type { OccasionType, SendStatus } from "@/lib/types";
import { OCCASION_LABELS, STATUS_LABELS } from "@/lib/types";

const STATUS_STYLES: Record<SendStatus, string> = {
  scheduled: "bg-pine-100 text-pine-700",
  paused: "bg-stone-200 text-stone-600",
  skipped: "bg-stone-100 text-stone-500",
  handwriting: "bg-gold-100 text-gold-600",
  assembling: "bg-amber-100 text-amber-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

export function StatusBadge({ status }: { status: SendStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function OccasionBadge({ occasion }: { occasion: OccasionType }) {
  return (
    <span className="inline-flex items-center rounded-full border border-pine-200 bg-pine-50 px-2.5 py-0.5 text-xs font-medium text-pine-700">
      {OCCASION_LABELS[occasion]}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-parchment px-2 py-0.5 text-xs text-pine-700">
      {children}
    </span>
  );
}
