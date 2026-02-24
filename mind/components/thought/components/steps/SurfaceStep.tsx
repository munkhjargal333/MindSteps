import { Layers } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { StepCopy } from '../../constants';

interface Props {
  cfg: StepCopy['surface'];
  value: string;
  onChange: (v: string) => void;
}

export function SurfaceStep({ cfg, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        {/* <div className="flex items-center gap-2 text-muted-foreground/60">
          <Layers size={13} />
          <span className="text-[10px] tracking-widest uppercase font-semibold">Гадаргуу</span>
        </div> */}
        <h2 className="text-xl font-bold leading-snug">{cfg.q}</h2>
        {/* <p className="text-sm text-muted-foreground">
          Бодол, дүрслэл, дуу чимээ — юу ч байсан бай
        </p> */}
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

      <p className="text-[11px] text-muted-foreground/50 italic text-center">
        Зөв буруу гэж байхгүй — ирж байгаагаа бич
      </p>
    </div>
  );
}
