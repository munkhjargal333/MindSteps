// ─────────────────────────────────────────────────────────────────────────────
// components/molecules/InsightCard.tsx
// MOLECULE — Single Seed Insight result card (Mirror / Reframe / Relief).
// Pure presentational.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';

export interface InsightCardProps {
  label: string;
  sub: string;
  dot: string;
  bg: string;
  content: string;
  animationDelay?: number;
}

export function InsightCard({
  label,
  sub,
  dot,
  bg,
  content,
  animationDelay = 0,
}: InsightCardProps) {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl animate-[fadeUp_0.4s_ease_both]',
        bg
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={cn('w-2 h-2 rounded-full', dot)} />
        <span className="text-[10px] font-semibold text-muted-foreground/60">
          {label}
        </span>
        <span className="text-[10px] text-muted-foreground/40">· {sub}</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">{content}</p>
    </div>
  );
}
