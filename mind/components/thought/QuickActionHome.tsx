'use client';

import { Sparkles } from 'lucide-react';
import { FREE_ACTIONS } from './constants';
import { QuickActionButton } from './components/QuickActionButton';
import type { QuickActionType } from './types';

interface Props {
  onSelectAction: (type: QuickActionType) => void;
  onUpgrade?: () => void;
}

export function QuickActionHome({ onSelectAction, onUpgrade }: Props) {
  const mainActions = FREE_ACTIONS.slice(0, 4);

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
      <div
        data-tour="demo-actions"
        className="grid grid-cols-2 gap-4"
      >
        {mainActions.map((action, index) => (
          // Tour target 3: эхний товч тусад нь
          <div
            key={action.type}
            data-tour={index === 0 ? 'demo-action-0' : undefined}
          >
            <QuickActionButton
              key={action.type}
              action={action}
              onSelect={onSelectAction}
              variant="compact"
              className="w-90%"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 text-center">
        <p className="text-[10px] text-muted-foreground/30 italic">
          "Бодол бол зөвхөн үүл, харин чи бол тэнгэр юм."
        </p>
      </div>
    </div>
  );
}