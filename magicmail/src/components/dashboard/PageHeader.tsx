export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-pine-800">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-pine-600/90">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
