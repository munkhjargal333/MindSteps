// ─────────────────────────────────────────────────────────────────────────────
// components/molecules/StepIndicator.tsx
// MOLECULE — Visual progress tracker for the 3-step journal flow.
// Pure presentational: receives current step number, renders done/active/idle.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';
import { STEPS } from '@/data/constants';

export interface StepIndicatorProps {
  /** 1-based current step index */
  current: number;
  className?: string;
}

export function StepIndicator({ current, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-center gap-0 mb-8', className)}>
      {STEPS.map((s, i) => {
        const done   = i < current - 1;
        const active = i === current - 1;
        const Icon   = s.icon;

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1 px-3 transition-all duration-300">
              <div
                className={cn(
                  'w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300',
                  active && 'bg-foreground text-background shadow-md scale-110',
                  done   && 'bg-foreground/10 text-foreground/60',
                  !active && !done && 'bg-muted text-muted-foreground'
                )}
              >
                <Icon size={15} />
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold tracking-widest uppercase transition-all',
                  active ? 'text-foreground' : 'text-muted-foreground/50'
                )}
              >
                {s.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'w-10 h-px mb-5 transition-all duration-500',
                  i < current - 1 ? 'bg-foreground/30' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
