'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { INSIGHT_CARDS, ACTION_MAP } from '../../../data/constants';
import type { SessionData } from '../../../types/types';
import type { AnalyzeResult } from '@/lib/api/api';

interface Props {
  session: SessionData;
  analyzing: boolean;
  result: AnalyzeResult | null;
  error: string | null;
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
  }, []);

  const actionCfg = ACTION_MAP[session.actionType];
  const Icon = actionCfg.icon;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="relative flex flex-col items-center text-center gap-3 pt-2 pb-1">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-500/70">
            Дотоод түлхэц
          </p>
          <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-snug">
            Таны туршлагаас<br />
            <span className="text-primary/70">харагдаж буй зүйл</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full max-w-[140px]">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-muted-foreground/15" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-muted-foreground/15" />
        </div>
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
                <span className="text-[10px] text-muted-foreground/40">· {card.sub}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {result.insight[card.key]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}