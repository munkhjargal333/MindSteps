'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listDeepInsights, type DeepInsight } from '@/lib/api/journalBackend';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { relativeTimeMn } from '@/lib/utils/date';

export default function InsightsPage() {
  const { token } = useAuth();
  const [insights, setInsights] = useState<DeepInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listDeepInsights(token);
      setInsights(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Deep Insights</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Таны бичлэгүүдээс гаргасан гүн дүгнэлтүүд
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2"
            onClick={load}
            disabled={loading}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Шинэчлэх
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-28 rounded-2xl bg-muted/40" />
            ))}
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
        {!loading && !error && insights.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Sparkles size={24} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-medium text-foreground/70">Insight байхгүй байна</p>
              <p className="text-sm text-muted-foreground mt-1">
                Бичлэгүүд хуримтлагдсаны дараа deep insight үүснэ
              </p>
            </div>
          </div>
        )}

        {/* Insights list */}
        {!loading && insights.length > 0 && (
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div
                key={insight.id ?? i}
                className={cn(
                  'p-5 rounded-2xl border bg-card space-y-3',
                  'animate-[fadeUp_0.4s_ease_both]',
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Sparkles size={12} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Deep Insight
                    </span>
                  </div>
                  {insight.created_at && (
                    <span className="text-[11px] text-muted-foreground/50">
                      {relativeTimeMn(insight.created_at)}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">{insight.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
