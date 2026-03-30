// ─────────────────────────────────────────────────────────────────────────────
// components/molecules/JournalTextarea.tsx
// MOLECULE — Combines a question heading + styled textarea.
// Shared across SurfaceStep, InnerReactionStep, MeaningStep organisms.
// ─────────────────────────────────────────────────────────────────────────────

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface JournalTextareaProps {
  question: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  dataTour?: string;
  className?: string;
}

const textareaClass = cn(
  'min-h-[180px] text-base resize-none',
  'bg-muted/40 border-0 rounded-2xl p-4',
  'focus-visible:ring-1 focus-visible:ring-foreground/20',
  'placeholder:text-muted-foreground/40'
);

export function JournalTextarea({
  question,
  placeholder,
  value,
  onChange,
  autoFocus = false,
  dataTour,
  className,
}: JournalTextareaProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold leading-snug">{question}</h2>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={textareaClass}
        autoFocus={autoFocus}
        data-tour={dataTour}
      />
    </div>
  );
}
