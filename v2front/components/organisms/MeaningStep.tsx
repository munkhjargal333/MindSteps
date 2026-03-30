// ─────────────────────────────────────────────────────────────────────────────
// components/organisms/MeaningStep.tsx
// ORGANISM — Step 3: "What does it mean?" journal entry step.
// ─────────────────────────────────────────────────────────────────────────────

import { JournalTextarea } from '@/components/molecules/JournalTextarea';
import type { StepCopy } from '@/types';

export interface MeaningStepProps {
  cfg: StepCopy['meaning'];
  value: string;
  onChange: (v: string) => void;
}

export function MeaningStep({ cfg, value, onChange }: MeaningStepProps) {
  return (
    <JournalTextarea
      question={cfg.q}
      placeholder={cfg.placeholder}
      value={value}
      onChange={onChange}
      autoFocus
    />
  );
}
