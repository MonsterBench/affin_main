// Hand-drawn line-icon set. Replaces emoji in the marketing UI so the site
// reads as a crafted brand rather than a template. Stroke-based, inherits
// currentColor, sized via the `className` prop (default 1.5rem).

type IconProps = { className?: string };

const base = "h-6 w-6";

export function PenIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      <path d="M14.5 5.5l3 3" />
    </svg>
  );
}

export function MailboxIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 11a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v7H3Z" />
      <path d="M7 7v11" />
      <path d="M17 9h2a2 2 0 0 1 2 2v3" />
      <path d="M11 11h3" />
    </svg>
  );
}

export function SparkleIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3c.4 3.6 1.4 4.6 5 5-3.6.4-4.6 1.4-5 5-.4-3.6-1.4-4.6-5-5 3.6-.4 4.6-1.4 5-5Z" />
      <path d="M19 14c.2 1.6.6 2 2 2-1.4.2-1.8.6-2 2-.2-1.6-.6-2-2-2 1.4-.2 1.8-.6 2-2Z" />
    </svg>
  );
}

export function ShieldIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function GiftIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8h14v-8" />
      <path d="M12 8v12" />
      <path d="M12 8C12 8 11 4 8.5 4S6 7 8 8h4Zm0 0s1-4 3.5-4S18 7 16 8h-4Z" />
    </svg>
  );
}

export function HeartIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0 1 12 7a3.7 3.7 0 0 1 7 3.7c0 5-7 9.3-7 9.3Z" />
    </svg>
  );
}

export function CakeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 21h16v-7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3Z" />
      <path d="M4 16c2 0 2 1.5 4 1.5S10 16 12 16s2 1.5 4 1.5S18 16 20 16" />
      <path d="M12 8V5" />
      <circle cx="12" cy="4" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function StarIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="m12 2 2.9 6.3L22 9.3l-5 4.7 1.3 6.9L12 17.6 5.7 20.9 7 14 2 9.3l7.1-1Z" />
    </svg>
  );
}

export function QrIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M21 14v0M17 21h4v-4M14 21h0" />
    </svg>
  );
}

export function CpuIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
    </svg>
  );
}

export function BoxIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3.3 7 8.7 4.5L20.7 7" />
      <path d="M12 11.5V21" />
      <path d="M20.5 7.3 12 3 3.5 7.3v9.4L12 21l8.5-4.3Z" />
    </svg>
  );
}

export function TruckIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 6h11v9H2zM13 9h4l4 3v3h-8z" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}
