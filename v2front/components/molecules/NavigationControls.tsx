// ─────────────────────────────────────────────────────────────────────────────
// components/molecules/NavigationControls.tsx
// MOLECULE — Back / Next button row used in the journal flow.
// Pure presentational: all logic (disabled state, step awareness) lives in hook.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface NavigationControlsProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  isFinalStep: boolean;
  backLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function NavigationControls({
  onBack,
  onNext,
  canProceed,
  isFinalStep,
  backLabel = 'Буцах',
  nextLabel = 'Үргэлжлүүлэх',
  className,
}: NavigationControlsProps) {
  return (
    <div className={cn('flex items-center gap-3 pt-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="rounded-xl text-muted-foreground"
      >
        <ChevronLeft size={16} className="mr-1" />
        {backLabel}
      </Button>

      <div className="flex-1" />

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="rounded-xl px-5"
      >
        {isFinalStep ? (
          <>
            <Sparkles size={13} className="mr-1.5" />
            Seed Insight
          </>
        ) : (
          <>
            {nextLabel}
            <ChevronRight size={15} className="ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}
