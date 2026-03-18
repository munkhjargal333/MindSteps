'use client';

import { Sparkles } from 'lucide-react';
import { FREE_ACTIONS } from '../../data/constants';
import { QuickActionButton } from './components/QuickActionButton';
import type { QuickActionType } from '../../types/types';

interface Props {
  onSelectAction: (type: QuickActionType) => void;
  onUpgrade?: () => void;
}

export function QuickActionHome({ onSelectAction, onUpgrade }: Props) {

  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-8">
      {/* Tour target 1: гарчиг хэсэг */}
      <div
        data-tour="demo-welcome"
        className="space-y-2 px-1 text-center sm:text-left"
      >
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-violet-500 font-bold">
          <Sparkles size={14} />
          <span className="text-[10px] uppercase tracking-[0.2em]">Ухаалаг тэмдэглэл</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Тавтай морил ✦</h2>
        <p className="text-sm text-muted-foreground italic">Өнөөдөр юу мэдэрч байна?</p>
      </div>

      {/* Tour target 2: товчнуудын grid */}
        <div data-tour="demo-actions" className="grid grid-cols-2 gap-4">
          {FREE_ACTIONS.map((action) => (
            <QuickActionButton
              key={action.type}
              action={action}
              onSelect={onSelectAction}
              variant="compact"
              className='w-full'
            />
          ))}
        </div>
    </div>
  );
}