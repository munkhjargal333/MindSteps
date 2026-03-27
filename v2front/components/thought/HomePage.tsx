'use client';

import { Lock, ArrowRight } from 'lucide-react';
import { FREE_ACTIONS, PRO_ACTIONS } from '../../data/constants';
import { useThoughtContext } from '../../contexts/context';
import { QuickActionButton } from './components/QuickActionButton';

interface Props {
  onSelectAction: (type: any) => void;
  onUpgrade?: () => void;
}

export function HomePage({ onSelectAction, onUpgrade }: Props) {
  const { tier } = useThoughtContext();
  const isPro = tier === 'pro';

  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Өнөөдрийн тусгал
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          Дотоод бодлоо цэгцэлье.
        </h1>
      </div>

      {/* Free actions */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground px-0.5">
          Үндсэн
        </p>
        <div className="grid grid-cols-2 gap-3">
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

      {/* Pro actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {isPro ? 'Pro' : 'Тун удахгүй'}
          </p>
          {!isPro && (
            <button
              onClick={onUpgrade}
              className="flex items-center gap-1 text-[11px] font-medium text-violet-500 hover:text-violet-600 transition-colors"
            >
              Шинэчлэх <ArrowRight size={11} />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {PRO_ACTIONS.slice(0, 4).map((action) => {
            const Icon = action.icon;

            if (isPro) {
              return (
                <button
                  key={action.type}
                  onClick={() => onSelectAction(action.type)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-muted/40 hover:bg-muted/70 border border-border transition-colors text-left"
                >
                  <div className="p-2 rounded-xl bg-background border border-border text-foreground">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{action.label}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{action.sub}</div>
                  </div>
                  <ArrowRight size={13} className="text-muted-foreground/40 shrink-0" />
                </button>
              );
            }

            return (
              <div
                key={action.type}
                className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-dashed border-border opacity-60 select-none"
              >
                <div className="p-2 rounded-xl bg-muted text-muted-foreground">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    {action.label}
                    <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full">
                      Тун удахгүй
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{action.sub}</div>
                </div>
                <Lock size={11} className="text-muted-foreground/30 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}