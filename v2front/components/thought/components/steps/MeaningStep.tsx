import { Compass } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { StepCopy } from '../../../../data/constants';

interface Props {
  cfg: StepCopy['meaning'];
  meaningText: string;
  onMeaningChange: (v: string) => void;
}

const textareaClass = cn(
  'min-h-[180px] resize-none text-base',
  'bg-muted/40 border-0 rounded-2xl p-4',
  'focus-visible:ring-1 focus-visible:ring-foreground/20',
  'placeholder:text-muted-foreground/40',
);

export function MeaningStep({
  cfg,
  meaningText,
  onMeaningChange,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold leading-snug">{cfg.q}</h2>
      </div>

      <Textarea
        value={meaningText}
        onChange={(e) => onMeaningChange(e.target.value)}
        placeholder={cfg.placeholder}
        className={textareaClass}
        autoFocus
      />

    </div>
  );
}