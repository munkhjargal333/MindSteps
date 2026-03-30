// ─────────────────────────────────────────────────────────────────────────────
// components/atoms/TierPill.tsx
// ATOM — Displays the user's subscription tier as a colored pill badge.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';
import type { Tier } from '@/types';

export interface TierPillProps {
  tier: Tier;
  className?: string;
}

const TIER_STYLES: Record<Tier, { label: string; dot: string; classes: string }> = {
  demo: {
    label: 'Demo',
    dot: '🔵',
    classes:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  free: {
    label: 'Үнэгүй',
    dot: '🟢',
    classes:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  },
  pro: {
    label: 'Pro',
    dot: '🟣',
    classes:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  },
};

export function TierPill({ tier, className }: TierPillProps) {
  const { label, dot, classes } = TIER_STYLES[tier];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        'text-[10px] font-bold uppercase tracking-wider',
        classes,
        className
      )}
    >
      <span>{dot}</span>
      {label} план
    </span>
  );
}
