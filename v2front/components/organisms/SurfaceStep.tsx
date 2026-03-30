// ─────────────────────────────────────────────────────────────────────────────
// components/organisms/SurfaceStep.tsx
// ORGANISM — Step 1: "What happened?" journal entry step.
// Composes JournalTextarea molecule with step-specific copy.
// ─────────────────────────────────────────────────────────────────────────────

import { JournalTextarea } from '@/components/molecules/JournalTextarea';
import type { StepCopy } from '@/types';

export interface SurfaceStepProps {
  cfg: StepCopy['surface'];
  value: string;
  onChange: (v: string) => void;
}

export function SurfaceStep({ cfg, value, onChange }: SurfaceStepProps) {
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
