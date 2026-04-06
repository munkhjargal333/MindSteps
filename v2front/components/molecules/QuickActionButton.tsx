'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/molecules/QuickActionButton.tsx
// MOLECULE — Clickable card for a single quick-action type.
// REFACTORED: Replaced bg-white/dark:bg-zinc-900 with bg-surface token.
//             Replaced bg-white/90 dark:bg-black/20 with bg-surface/90.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActionConfig, QuickActionType } from '@/types';

export interface QuickActionButtonProps {
  action: ActionConfig;
  onSelect?: (type: QuickActionType) => void;
  onUpgrade?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
  showArrow?: boolean;
  className?: string;
}

export function QuickActionButton({
  action,
  onSelect,
  onUpgrade,
  disabled = false,
  variant = 'default',
  showArrow = true,
  className,
}: QuickActionButtonProps) {
  const Icon = action.icon;
  const isDisabled = disabled || !onSelect;

  const handleClick = () => {
    if (isDisabled) { onUpgrade?.(); return; }
    onSelect?.(action.type);
  };

  const isCompact = variant === 'compact';

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative text-left overflow-hidden transition-all',
        isCompact
          // Compact: uses the action's own bg color token (from data/constants)
          ? cn('flex flex-col items-start p-5 rounded-[2.5rem] border border-border min-h-[160px]', action.bg)
          // Default: token-based surface card
          : 'flex flex-col items-start p-5 rounded-[2.5rem] bg-surface border border-border shadow-sm',
        !isDisabled && 'hover:border-border hover:shadow-md hover:scale-[1.02] active:scale-[0.95]',
        isDisabled && 'bg-muted/30 border-dashed border-border opacity-60 grayscale cursor-not-allowed',
        className
      )}
    >
      {/* Lock badge */}
      {isDisabled && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
          <Lock size={10} />Pro
        </div>
      )}

      {/* Icon container */}
      <div
        className={cn(
          'p-3 rounded-2xl mb-4 transition-transform',
          isCompact
            // Compact: subtle surface overlay on top of the colored card bg
            ? cn('bg-surface/80 shadow-sm', action.color)
            // Default: full action color block
            : cn(action.bg, action.color),
          !isDisabled && 'group-hover:scale-110 group-hover:rotate-3'
        )}
      >
        <Icon size={isCompact ? 24 : 22} />
      </div>

      {/* Labels */}
      <div className="space-y-1">
        <div className={cn('font-bold text-sm leading-tight', isCompact && action.color)}>
          {action.label}
        </div>
        <div className="text-[10px] text-muted-foreground/80 leading-snug font-medium">
          {action.sub}
        </div>
      </div>

      {/* Arrow */}
      {showArrow && !isDisabled && (
        <ArrowRight
          size={14}
          className="absolute bottom-5 right-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all"
        />
      )}

      {/* Background ghost icon (compact only) */}
      {isCompact && (
        <Icon
          size={40}
          className={cn('absolute -bottom-2 -right-2 opacity-5 rotate-12', action.color)}
        />
      )}
    </button>
  );
}
