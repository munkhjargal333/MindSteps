// ─────────────────────────────────────────────────────────────────────────────
// components/atoms/ProgressBar.tsx
// ATOM — Generic progress indicator. Accepts current + total, derives %.
// ─────────────────────────────────────────────────────────────────────────────

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  current,
  total,
  showLabel = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={cn('w-full space-y-2', className)}>
      <Progress value={percentage} className="h-2" />
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {current} of {total}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
}
