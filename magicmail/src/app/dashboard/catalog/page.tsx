import { PageHeader } from "@/components/dashboard/PageHeader";
import { OccasionBadge } from "@/components/ui/Badge";
import { CATALOG } from "@/lib/catalog";
import { currency } from "@/lib/format";

const CATEGORY_LABELS: Record<string, string> = {
  letter: "Letters",
  giftbox: "Gift boxes",
  treat: "Treats",
  keepsake: "Keepsakes",
  card: "Cards",
};

export default function CatalogPage() {
  const byCategory = CATALOG.reduce<Record<string, typeof CATALOG>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Gift catalog"
        subtitle="Curated, never-repeating gifts — every one finished with a handwritten note."
      />

      <div className="space-y-10">
        {Object.entries(byCategory).map(([category, products]) => (
          <section key={category}>
            <h2 className="mb-4 font-display text-lg font-semibold text-pine-800">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const margin = Math.round(((p.price - p.cost) / p.price) * 100);
                return (
                  <div
                    key={p.id}
                    className="flex flex-col rounded-2xl border border-pine-100 bg-white p-5 shadow-card transition hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-pine-50 text-2xl">
                        {p.emoji}
                      </span>
                      <span className="rounded-full bg-parchment px-2.5 py-0.5 text-xs font-medium capitalize text-pine-700">
                        {p.tier}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-base font-semibold text-pine-800">{p.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-pine-600/90">{p.blurb}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.occasions.slice(0, 3).map((o) => (
                        <OccasionBadge key={o} occasion={o} />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-pine-100 pt-3">
                      <span className="font-display text-lg font-semibold text-pine-800">{currency(p.price)}</span>
                      <span className="text-xs text-pine-500">{margin}% margin</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
