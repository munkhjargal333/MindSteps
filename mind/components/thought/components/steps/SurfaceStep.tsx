import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { StepCopy } from '../../../../data/constants';

interface Props {
  cfg: StepCopy['surface'];
  value: string;
  onChange: (v: string) => void;
}

export function SurfaceStep({ cfg, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold leading-snug">{cfg.q}</h2>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={cfg.placeholder}
        className={cn(
          'min-h-[180px] text-base resize-none',
          'bg-muted/40 border-0 rounded-2xl p-4',
          'focus-visible:ring-1 focus-visible:ring-foreground/20',
          'placeholder:text-muted-foreground/40',
        )}
        autoFocus
      />
    </div>
  );
}
