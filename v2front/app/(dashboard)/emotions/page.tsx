'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmotionStats } from '@/lib/hooks/useEmotionStats';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const PERIOD_OPTIONS = [
  { label: '7 хоног', value: 7 },
  { label: '30 хоног', value: 30 },
  { label: '90 хоног', value: 90 },
] as const;

// Plutchik emotion color map
const EMOTION_COLORS: Record<string, string> = {
  joy:          'bg-yellow-400',
  trust:        'bg-emerald-500',
  fear:         'bg-green-400',
  surprise:     'bg-teal-400',
  sadness:      'bg-blue-500',
  disgust:      'bg-violet-500',
  anger:        'bg-red-500',
  anticipation: 'bg-orange-400',
};

function emotionColor(emotion: string) {
  const key = emotion.toLowerCase();
  return EMOTION_COLORS[key] ?? 'bg-muted-foreground/40';
}

export default function EmotionsPage() {
  const { token } = useAuth();
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const { stats, loading, error } = useEmotionStats(token, days);

  const maxCount = Math.max(...stats.map((s) => Number(s.count) || 0), 1);

  return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Сэтгэл хөдлөл</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Плутчикийн загварт суурилсан дүн шинжилгээ
            </p>
          </div>
          {/* Period selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60">
            {PERIOD_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setDays(value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  days === value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && stats.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <BarChart2 size={24} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-medium text-foreground/70">Мэдээлэл байхгүй</p>
              <p className="text-sm text-muted-foreground mt-1">
                Бичлэгүүд хуримтлагдсаны дараа статистик харагдана
              </p>
            </div>
          </div>
        )}

        {/* Bar chart */}
        {!loading && stats.length > 0 && (
          <div className="space-y-3">
            {stats.map((stat, i) => {
              const count = Number(stat.count) || 0;
              const pct = Math.round((count / maxCount) * 100);
              const displayPct = stat.percentage != null
                ? `${Math.round(Number(stat.percentage))}%`
                : null;

              return (
                <div
                  key={stat.emotion ?? i}
                  className="flex items-center gap-4 animate-[fadeUp_0.3s_ease_both]"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Label */}
                  <div className="w-28 shrink-0">
                    <p className="text-sm font-medium capitalize truncate">{stat.emotion}</p>
                    {displayPct && (
                      <p className="text-xs text-muted-foreground">{displayPct}</p>
                    )}
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-8 bg-muted/40 rounded-xl overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-xl transition-all duration-700',
                        emotionColor(stat.emotion)
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Count */}
                  <span className="w-10 shrink-0 text-sm font-bold text-right text-foreground/70">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {!loading && stats.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground/50 text-center">
              Сүүлийн {days} хоногийн мэдээлэл · Плутчикийн 8 үндсэн сэтгэл хөдлөл
            </p>
          </div>
        )}
      </div>
  );
}
