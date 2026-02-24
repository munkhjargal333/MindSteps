import { Compass } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { StepCopy } from '../../constants';

interface Props {
  cfg: StepCopy['meaning'];
  whatMatters: string;
  onMattersChange: (v: string) => void;
}

const textareaClass = cn(
  'min-h-[180px] resize-none text-base',
  'bg-muted/40 border-0 rounded-2xl p-4',
  'focus-visible:ring-1 focus-visible:ring-foreground/20',
  'placeholder:text-muted-foreground/40',
);

export function MeaningStep({
  cfg,
  whatMatters,
  onMattersChange,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        {/* <div className="flex items-center gap-2 text-muted-foreground/60">
          <Compass size={13} />
          <span className="text-[10px] tracking-widest uppercase font-semibold">Үнэт зүйл</span>
        </div> */}
        <h2 className="text-xl font-bold leading-snug">{cfg.q}</h2>
        {/* <p className="text-sm text-muted-foreground">
          Мэдрэмжийн цаана байгаа утга учрыг хайж байна
        </p> */}
      </div>

      <Textarea
        value={whatMatters}
        onChange={(e) => onMattersChange(e.target.value)}
        placeholder={cfg.placeholder}
        className={textareaClass}
        autoFocus
      />

      <p className="text-[11px] text-muted-foreground/50 italic text-center">
        Гүнээс ирж байгааг бич
      </p>
    </div>
  );
}