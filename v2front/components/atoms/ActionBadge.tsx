// ─────────────────────────────────────────────────────────────────────────────
// components/atoms/ActionBadge.tsx
// ATOM — Displays a labeled badge for a QuickActionType.
// Pure presentational: receives type prop, reads config from constants.
// NO hooks, NO state.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';
import type { QuickActionType } from '@/types';
import { ACTION_MAP } from '@/data/constants';

export interface ActionBadgeProps {
  type: QuickActionType;
  size?: 'sm' | 'md';
  className?: string;
}

export function ActionBadge({ type, size = 'sm', className }: ActionBadgeProps) {
  const cfg = ACTION_MAP[type];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider',
        size === 'sm' ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs',
        cfg.bg,
        cfg.color,
        className
      )}
    >
      <Icon size={size === 'sm' ? 11 : 13} />
      {cfg.label}
    </div>
  );
}
