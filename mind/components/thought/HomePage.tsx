// HomePage.tsx
'use client';

import { Sparkles, Lock, LayoutGrid } from 'lucide-react';
import { FREE_ACTIONS, PRO_ACTIONS } from '../../data/constants';
import { useThoughtContext } from '../../contexts/context';
import { QuickActionButton } from './components/QuickActionButton';

interface Props {
  onSelectAction: (type: any) => void;
  onUpgrade?: () => void;
}

export function HomePage({ onSelectAction, onUpgrade }: Props) {
  const { tier } = useThoughtContext();

  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <span className="text-sm font-semibold tracking-tight">Өнөөдрийн тусгал</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Сайн уу? <br/>
          <span className="text-muted-foreground font-light">Дотоод бодлоо цэгцэлье.</span>
        </h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Үндсэн цэс</h2>
          <LayoutGrid size={14} className="text-muted-foreground/50" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {FREE_ACTIONS.map((action) => (
            <QuickActionButton
              key={action.type}
              action={action}
              onSelect={onSelectAction}
              variant="compact"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Тун удахгүй</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {PRO_ACTIONS.slice(0, 3).map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.type}
                className="flex items-center gap-4 p-4 rounded-[1.8rem] bg-muted/30 border border-dashed border-border opacity-70 grayscale-[0.5]"
              >
                <div className="p-2.5 rounded-2xl bg-muted text-muted-foreground">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    {action.label}
                    <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full font-medium">Тун удахгүй</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{action.sub}</div>
                </div>
                <Lock size={12} className="text-muted-foreground/30 mr-2" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 text-center">
         <p className="text-[11px] text-muted-foreground/40 italic leading-relaxed">
           "Бодол гэдэг үүл шиг, ирээд л өнгөрнө. <br/> 
           Бид зөвхөн ажиглагч нь юм."
         </p>
      </div>
    </div>
  );
}