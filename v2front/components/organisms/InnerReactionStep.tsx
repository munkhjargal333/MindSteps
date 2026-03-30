// ─────────────────────────────────────────────────────────────────────────────
// components/organisms/InnerReactionStep.tsx
// ORGANISM — Step 2: "How did it feel?" journal entry step.
// Adds data-tour attributes for onboarding tour support.
// ─────────────────────────────────────────────────────────────────────────────

import { JournalTextarea } from '@/components/molecules/JournalTextarea';
import type { StepCopy } from '@/types';

export interface InnerReactionStepProps {
  cfg: StepCopy['inner'];
  value: string;
  onChange: (v: string) => void;
}

export function InnerReactionStep({ cfg, value, onChange }: InnerReactionStepProps) {
  return (
    <div data-tour="demo-step-2">
      <JournalTextarea
        question={cfg.q}
        placeholder={cfg.placeholder}
        value={value}
        onChange={onChange}
        autoFocus
        dataTour="demo-step-1"
      />
    </div>
  );
}
