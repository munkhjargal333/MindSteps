// ─────────────────────────────────────────────────────────────────────────────
// components/organisms/ThoughtFlow.tsx
// ORGANISM — The full 4-step journaling wizard.
// Wires together step organisms + navigation molecules.
// Delegates ALL logic to useJournalFlow hook.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useJournalFlow } from '@/features/journal/hooks/useJournalFlow';
import { StepIndicator } from '@/components/molecules/StepIndicator';
import { NavigationControls } from '@/components/molecules/NavigationControls';
import { SurfaceStep } from '@/components/organisms/SurfaceStep';
import { InnerReactionStep } from '@/components/organisms/InnerReactionStep';
import { MeaningStep } from '@/components/organisms/MeaningStep';
import { SeedInsightStep } from '@/components/organisms/SeedInsightStep';
import { STEP_CONFIG } from '@/data/constants';
import type { QuickActionType } from '@/types';

export interface ThoughtFlowProps {
  initialAction: QuickActionType;
  onBack: () => void;
  onComplete: () => void;
  /** Called when user clicks "Дахин" — increment usage counter, stay on action */
  onReset: () => void;
}

export function ThoughtFlow({
  initialAction,
  onBack,
  onComplete,
  onReset,
}: ThoughtFlowProps) {
  const flow = useJournalFlow(onBack);

  // Sync external initialAction into the hook
  useEffect(() => {
    if (initialAction) flow.selectAction(initialAction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAction]);

  const cfg = STEP_CONFIG[flow.actionType ?? ''];

  if (!flow.actionType || !cfg) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Алдаа гарлаа. Дахин оролдоно уу.
      </div>
    );
  }

  const session = flow.session!;

  // ── Step 4: Seed Insight ───────────────────────────────────────────────────
  if (flow.step === 4) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-4 space-y-5">
        <SeedInsightStep
          session={session}
          analyzing={flow.analyzing}
          result={flow.result}
          error={flow.error}
          onMount={flow.runAnalysis}
        />

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl"
            onClick={() => { flow.reset(); onReset(); }}
          >
            <RefreshCw size={13} className="mr-1.5" />
            Дахин
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-2xl"
            onClick={onComplete}
          >
            Нүүр хуудас
          </Button>
        </div>
      </div>
    );
  }

  // ── Steps 1–3 ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
      <StepIndicator current={flow.step} />

      <div className="min-h-[320px]">
        {flow.step === 1 && (
          <SurfaceStep
            cfg={cfg.surface}
            value={flow.data.surfaceText}
            onChange={(v) => flow.updateData({ surfaceText: v })}
          />
        )}
        {flow.step === 2 && (
          <InnerReactionStep
            cfg={cfg.inner}
            value={flow.data.innerText}
            onChange={(v) => flow.updateData({ innerText: v })}
          />
        )}
        {flow.step === 3 && (
          <MeaningStep
            cfg={cfg.meaning}
            value={flow.data.meaningText}
            onChange={(v) => flow.updateData({ meaningText: v })}
          />
        )}
      </div>

      <NavigationControls
        onBack={flow.back}
        onNext={flow.next}
        canProceed={flow.canProceed}
        isFinalStep={flow.step === 3}
      />
    </div>
  );
}
