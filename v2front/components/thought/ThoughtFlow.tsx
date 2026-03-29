'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { useThoughtFlow } from '../../lib/hooks/useThoughtFlow';
import { StepIndicator } from './components/StepIndicator';
import { SurfaceStep } from './components/steps/SurfaceStep';
import { InnerReactionStep } from './components/steps/InnerReactionStep';
import { MeaningStep } from './components/steps/MeaningStep';
import { SeedInsightStep } from './components/SeedInsightStep';
import { STEP_CONFIG } from '../../data/constants';
import type { QuickActionType } from '../../types/types';

interface Props {
  initialAction: QuickActionType;
  onBack: () => void;
  onComplete: () => void;
  onReset: () => void;   // ← Дахин: increment хийж, step 1 руу буцах
  onUpgrade?: () => void;
}

export function ThoughtFlow({ initialAction, onBack, onComplete, onReset, onUpgrade }: Props) {
  const flow = useThoughtFlow(onBack);

  useEffect(() => {
    if (initialAction) {
      flow.selectAction(initialAction);
    }
  }, [initialAction, flow.selectAction]);

  const cfg = STEP_CONFIG[flow.actionType || '']

  if (!flow.actionType || !cfg) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Алдаа гарлаа. Дахин оролдоно уу.
      </div>
    )
  }

  const session = { actionType: flow.actionType, ...flow.data };

  // ── Step 4: Seed Insight ─────────────────────────────────────
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
            onClick={() => {
              flow.reset();  // step 1 болгоно
              onReset();     // increment хийнэ, нүүр рүү явахгүй
            }}
          >
            <RefreshCw size={13} className="mr-1.5" /> Дахин
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

  // ── Steps 1–3 ────────────────────────────────────────────────
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
            innerText={flow.data.innerText}
            onInnerTextChange={(v) => flow.updateData({ innerText: v })}
          />
        )}
        {flow.step === 3 && (
          <MeaningStep
            cfg={cfg.meaning}
            meaningText={flow.data.meaningText}
            onMeaningChange={(v) => flow.updateData({ meaningText: v })}
          />
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={flow.back}
          className="rounded-xl text-muted-foreground"
        >
          <ChevronLeft size={16} className="mr-1" /> Буцах
        </Button>
        <div className="flex-1" />
        <Button
          onClick={flow.next}
          disabled={!flow.canProceed}
          className="rounded-xl px-5"
        >
          {flow.step === 3 ? (
            <>
              <Sparkles size={13} className="mr-1.5" />Seed Insight
            </>
          ) : (
            <>
              Үргэлжлүүлэх<ChevronRight size={15} className="ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}