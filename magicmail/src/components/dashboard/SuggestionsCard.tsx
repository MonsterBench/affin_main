import Link from "next/link";
import { ComposeSendButton } from "@/components/dashboard/ComposeSendButton";
import { OccasionBadge } from "@/components/ui/Badge";
import { giftName } from "@/lib/memory";
import type { Suggestion } from "@/lib/memory";

interface RecipientLite {
  id: string;
  name: string;
  firstName: string;
}

// "Memory Keeper" — proactive moments to send. The category-defining surface:
// the app suggests when to be thoughtful, not just executes rules.
export function SuggestionsCard({
  suggestions,
  recipients,
}: {
  suggestions: Suggestion[];
  recipients: RecipientLite[];
}) {
  return (
    <div className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-pine-800">✨ Moments to remember</h2>
          <p className="text-xs text-pine-500">People worth a thoughtful touch right now.</p>
        </div>
        <Link href="/dashboard/recipients" className="text-sm font-medium text-pine-600 hover:underline">
          All recipients →
        </Link>
      </div>

      {suggestions.length === 0 ? (
        <p className="mt-6 rounded-xl bg-pine-50 px-4 py-6 text-center text-sm text-pine-500">
          You&apos;re all caught up — no one&apos;s slipping through the cracks. 🎉
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {suggestions.map((s) => (
            <li
              key={`${s.recipientId}:${s.occasion}`}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-pine-50 bg-cream/40 p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/recipients/${s.recipientId}`}
                    className="truncate font-medium text-pine-800 hover:underline"
                  >
                    {s.recipientName}
                  </Link>
                  <OccasionBadge occasion={s.occasion} />
                </div>
                <p className="mt-0.5 text-xs text-pine-500">
                  {s.reason} · suggest <span className="font-medium text-pine-600">{giftName(s.suggestedGiftId)}</span>
                </p>
              </div>
              <ComposeSendButton
                recipients={recipients}
                label="Send"
                variant="ghost"
                preset={{ recipientId: s.recipientId, occasion: s.occasion, giftId: s.suggestedGiftId }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
