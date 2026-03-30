// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/emotions/page.tsx  — CLIENT COMPONENT
// Plutchik's Wheel of Emotions — stats view.
// Data logic in useEmotionStats. This file: pure rendering.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { Suspense } from 'react';
import { BarChart2 } from 'lucide-react';
import { useEmotionStats } from '@/features/emotions/hooks/useEmotionStats';
import { useThoughtContext } from '@/contexts/TierContext';
import { cn } from '@/lib/utils';

export default function EmotionsPage() {
  return (
    <Suspense fallback={<EmotionsSkeleton />}>
      <EmotionsView />
    </Suspense>
  );
}

function EmotionsView() {
  const { token } = useThoughtContext();
  const { stats, loading, error } = useEmotionStats(token);

  const maxScore = Math.max(...stats.map((s) => s.score_sum), 1);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Сэтгэл хөдлөл</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Плутчикийн сэтгэл хөдлөлийн хүрд
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {loading && <EmotionsSkeleton />}

      {!loading && stats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <BarChart2 size={32} className="opacity-30" />
          <p className="text-sm">Өгөгдөл байхгүй байна</p>
        </div>
      )}

      {!loading && stats.length > 0 && (
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.emotion} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">{stat.emotion}</span>
                <span className="text-muted-foreground text-xs">
                  {stat.count}x · {stat.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70 transition-all duration-700"
                  style={{ width: `${(stat.score_sum / maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmotionsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
          <div className="h-2.5 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}
