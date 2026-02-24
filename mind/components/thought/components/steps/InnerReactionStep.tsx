import { Flame } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { StepCopy } from '../../constants';

interface Props {
  cfg: StepCopy['inner'];
  bodyFelt: string;
  onBodyChange: (v: string) => void;
}

const textareaClass = cn(
  'min-h-[180px] resize-none text-base',
  'bg-muted/40 border-0 rounded-2xl p-4',
  'focus-visible:ring-1 focus-visible:ring-foreground/20',
  'placeholder:text-muted-foreground/40',
);

export function InnerReactionStep({
  cfg,
  bodyFelt,
  onBodyChange,
}: Props) {
  return (
    <div className="space-y-6" data-tour="demo-step-2">
      <div className="space-y-1.5">
        {/* <div className="flex items-center gap-2 text-muted-foreground/60">
          <Flame size={13} />
          <span className="text-[10px] tracking-widest uppercase font-semibold">Дотоод хариу</span>
        </div> */}
        <h2 data-tour="demo-step-0" className="text-xl font-bold leading-snug">{cfg.q}</h2>
        {/* <p className="text-sm text-muted-foreground">
          Оюун санаа биеэ мэдэрч, анзаарч байна
        </p> */}
      </div>

      <Textarea
        value={bodyFelt}
        data-tour="demo-step-1"
        onChange={(e) => onBodyChange(e.target.value)}
        placeholder={cfg.placeholder}
        className={textareaClass}
        autoFocus
      />

      <p className="text-[11px] text-muted-foreground/50 italic text-center">
        Биеийн мэдрэмжид анхаарах нь чухал
      </p>
    </div>
  );
}