'use client';

import { use, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEntry } from '@/lib/hooks/useEntries';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDatetimeMn } from '@/lib/utils/date';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Lock,
  FileText,
  Eye,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { getSeedInsight, type SeedInsightData } from '@/lib/api/journalBackend';

// ─── Insight card config ──────────────────────────────────────

const INSIGHT_CARDS = [
  { key: 'mirror'  as const, label: 'Mirror',  sub: 'Чиний хэлснийг тусгавал', dot: 'bg-blue-400',    bg: 'bg-blue-50/60 dark:bg-blue-950/15'    },
  { key: 'reframe' as const, label: 'Reframe', sub: 'Өнцгийг эргүүлэвэл',      dot: 'bg-violet-400',  bg: 'bg-violet-50/60 dark:bg-violet-950/15' },
  { key: 'relief'  as const, label: 'Relief',  sub: 'Ачааг хөнгөлөвөл',        dot: 'bg-emerald-400', bg: 'bg-emerald-50/60 dark:bg-emerald-950/15'},
  { key: 'summary' as const, label: 'Summary', sub: 'Хураангуй',                dot: 'bg-amber-400',   bg: 'bg-amber-50/60 dark:bg-amber-950/15'   },
] as const;

// ─── Section block ────────────────────────────────────────────

function Section({ label, content }: { label: string; content: string | null }) {
  if (!content) return null;
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
      <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 rounded-2xl p-4">{content}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function EntryDetailPage({
  params,
}: {
  params: Promise<{ entry_id: string }>;
}) {
  const { entry_id } = use(params);
  const { token } = useAuth();
  const { entry, loading, error } = useEntry(token, entry_id);

  const [insight, setInsight]           = useState<SeedInsightData | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const loadInsight = async () => {
    if (!token || !entry_id) return;
    setInsightLoading(true);
    setInsightError(null);
    try {
      const data = await getSeedInsight(token, entry_id);
      setInsight(data);
    } catch (err) {
      setInsightError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setInsightLoading(false);
    }
  };

  return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
        {/* Back */}
        <Link href="/entries">
          <Button variant="ghost" size="sm" className="rounded-xl gap-2 -ml-2 text-muted-foreground">
            <ArrowLeft size={14} />
            Бичлэгүүд
          </Button>
        </Link>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
            <AlertCircle size={16} />{error}
          </div>
        )}

        {/* Entry */}
        {entry && (
          <>
            {/* Meta */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  #{entry.entry_index}
                </span>
                {entry.is_encrypted && (
                  <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full">
                    <Lock size={10} />Шифрлэгдсэн
                  </span>
                )}
                {!entry.is_text_saved && (
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    <FileText size={10} />Текст хадгалаагүй
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{formatDatetimeMn(entry.created_at)}</p>
            </div>

            {/* Texts */}
            <div className="space-y-4">
              <Section label="Гадаргуу"    content={entry.surface_text} />
              <Section label="Дотоод хариу" content={entry.inner_reaction_text} />
              <Section label="Утга"         content={entry.meaning_text} />
            </div>

            {/* Seed Insight */}
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base">Seed Insight</h2>
                <Button
                  variant="outline" size="sm"
                  className="rounded-xl gap-2 text-xs"
                  onClick={loadInsight}
                  disabled={insightLoading}
                >
                  {insightLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : insight ? (
                    <RefreshCw size={12} />
                  ) : (
                    <Eye size={12} />
                  )}
                  {insight ? 'Дахин' : 'Харах'}
                </Button>
              </div>

              {insightLoading && (
                <div className="space-y-3 animate-pulse">
                  {INSIGHT_CARDS.map((c) => (
                    <div key={c.key} className="h-20 rounded-2xl bg-muted/30" />
                  ))}
                </div>
              )}

              {insightError && (
                <p className="text-sm text-destructive">{insightError}</p>
              )}

              {insight && (
                <div className="space-y-3">
                  {INSIGHT_CARDS.map((card) => {
                    const text = insight[card.key];
                    if (!text) return null;
                    return (
                      <div
                        key={card.key}
                        className={cn(
                          'p-4 rounded-2xl animate-[fadeUp_0.4s_ease_both]',
                          card.bg
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn('w-2 h-2 rounded-full', card.dot)} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            {card.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground/40">· {card.sub}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80">{text}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
  );
}
