import Link from "next/link";

export function Logo({
  className = "",
  tone = "dark",
  href = "/",
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string;
}) {
  const text = tone === "light" ? "text-cream" : "text-pine-800";
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="grid h-9 w-9 place-items-center rounded-full bg-pine-700 text-gold-300 shadow-card"
        aria-hidden
      >
        {/* simple envelope-with-star mark */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
          <path d="M12 2.2l.7 1.6 1.7.2-1.3 1.2.4 1.7L12 6.1l-1.5.8.4-1.7L9.6 4l1.7-.2z" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className={`font-display text-xl font-semibold tracking-tight ${text}`}>Kringle</span>
    </Link>
  );
}
