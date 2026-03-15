import { Flame } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { StepCopy } from '../../../../data/constants';

interface Props {
  cfg: StepCopy['inner'];
  innerText: string;
  onInnerTextChange: (v: string) => void;
}

const textareaClass = cn(
  'min-h-[180px] resize-none text-base',
  'bg-muted/40 border-0 rounded-2xl p-4',
  'focus-visible:ring-1 focus-visible:ring-foreground/20',
  'placeholder:text-muted-foreground/40',
);

export function InnerReactionStep({
  cfg,
  innerText,
  onInnerTextChange,
}: Props) {
  return (
    <div className="space-y-6" data-tour="demo-step-2">
      <div className="space-y-1.5">
        <h2 data-tour="demo-step-0" className="text-xl font-bold leading-snug">{cfg.q}</h2>
      </div>

      <Textarea
        value={innerText}
        data-tour="demo-step-1"
        onChange={(e) => onInnerTextChange(e.target.value)}
        placeholder={cfg.placeholder}
        className={textareaClass}
        autoFocus
      />
    </div>
  );
}