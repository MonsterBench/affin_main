export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-card ${
        accent ? "border-pine-600 bg-pine-700 text-cream" : "border-pine-100 bg-white"
      }`}
    >
      <p className={`text-sm ${accent ? "text-cream/75" : "text-pine-600/80"}`}>{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accent ? "text-cream" : "text-pine-800"}`}>
        {value}
      </p>
      {hint && <p className={`mt-1 text-xs ${accent ? "text-gold-200" : "text-pine-500"}`}>{hint}</p>}
    </div>
  );
}
