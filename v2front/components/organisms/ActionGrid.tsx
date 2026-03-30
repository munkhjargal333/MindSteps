// ─────────────────────────────────────────────────────────────────────────────
// components/organisms/ActionGrid.tsx
// ORGANISM — Renders free + pro action grids.
// Reads tier from context internally (only organism layer may use context).
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { ArrowRight, Lock } from 'lucide-react';
import { QuickActionButton } from '@/components/molecules/QuickActionButton';
import { FREE_ACTIONS, PRO_ACTIONS } from '@/data/constants';
import { useThoughtContext } from '@/contexts/TierContext';
import type { QuickActionType } from '@/types';

export interface ActionGridProps {
  onSelectAction: (type: QuickActionType) => void;
  onUpgrade?: () => void;
  /** If true, only show free actions in compact 2-col grid (e.g. demo page) */
  demoMode?: boolean;
}

export function ActionGrid({ onSelectAction, onUpgrade, demoMode = false }: ActionGridProps) {
  const { tier } = useThoughtContext();
  const isPro = tier === 'pro';

  if (demoMode) {
    return (
      <div data-tour="demo-actions" className="grid grid-cols-2 gap-4">
        {FREE_ACTIONS.map((action) => (
          <QuickActionButton
            key={action.type}
            action={action}
            onSelect={onSelectAction}
            variant="compact"
            className="w-full"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
