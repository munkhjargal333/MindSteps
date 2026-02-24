'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { INSIGHT_CARDS, ACTION_MAP } from '../constants';
import type { SessionData } from '../types';
import type { AnalyzeResult } from '../api';

interface Props {
  session: SessionData;
  analyzing: boolean;
  result: AnalyzeResult | null;
  error: string | null;
  /** Эх component-с runAnalysis дуудагдана (useEffect trigger) */
  onMount: (session: SessionData) => void;
}

export function SeedInsightStep({
  session,
  analyzing,
  result,
  error,
  onMount,
}: Props) {
  useEffect(() => {
    onMount(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Зөвхөн нэг удаа mount дээр

  const actionCfg = ACTION_MAP[session.actionType];
  const Icon = actionCfg.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <div className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
          'text-[11px] font-bold uppercase tracking-widest',
          actionCfg.bg, actionCfg.color,
        )}>
          <Icon size={11} />
          {actionCfg.label}
        </div>
        <h2 className="text-xl font-bold">Seed Insight</h2>
        <p className="text-[12px] text-muted-foreground/60 leading-relaxed">
          Зөвлөгөө биш · Онош биш · Summary биш
        </p>
      </div>

      {/* Thought echo */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-muted/30 border border-muted">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold mb-2">
          Бичсэн зүйл
        </p>
        <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
          {session.surfaceText}
        </p>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      </div>

      {/* Loading skeleton */}
      {analyzing && (
        <div className="space-y-4 animate-pulse">
          {INSIGHT_CARDS.map((card) => (
            <div key={card.key} className="p-5 rounded-2xl bg-muted/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <div className="h-3 w-20 rounded bg-muted-foreground/15" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-muted-foreground/10" />
                <div className="h-3 w-4/5 rounded bg-muted-foreground/10" />
              </div>
            </div>
          ))}
          <p className="text-center text-[11px] text-muted-foreground/40 animate-pulse">
            Уншиж байна...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* Insight cards */}
      {result && (
        <div className="space-y-3">
          {INSIGHT_CARDS.map((card, i) => (
            <div
              key={card.key}
              className={cn(
                'p-5 rounded-2xl',
                'animate-[fadeUp_0.4s_ease_both]',
                card.bg,
              )}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('w-2 h-2 rounded-full', card.dot)} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {card.label}
                </span>
                <span className="text-[10px] text-muted-foreground/40">· {card.sub}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {result.insight[card.key]}
              </p>
            </div>
          ))}

          {result.entryId && (
            <p className="text-center text-[10px] text-muted-foreground/30 pt-1">
              ✓ тэмдэглэл #{result.entryId} хадгалагдлаа
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="pt-2 border-t border-dashed border-muted-foreground/10">
        <p className="text-[11px] text-center text-muted-foreground/40 italic leading-relaxed">
          "Бодол бол үүл шиг ирээд өнгөрнө.<br />
          Харин та бол тэр үүлсийг ажиглаж буй тэнгэр."
        </p>
      </div>
    </div>
  );
}
