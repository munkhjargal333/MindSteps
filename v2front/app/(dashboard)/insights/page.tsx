// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/insights/page.tsx  — CLIENT COMPONENT
// Maslow's Hierarchy deep insights view.
// Data logic in useInsights. This file: pure rendering.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { Suspense } from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useInsights } from '@/features/insights/hooks/useInsights';
import { useThoughtContext } from '@/contexts/TierContext';
import { formatDateShortShort } from '@/lib/utils/date';

export default function InsightsPage() {
  return (
    <Suspense fallback={<InsightsSkeleton />}>
      <InsightsView />
    </Suspense>
  );
}

function InsightsView() {
  const { token, tier } = useThoughtContext();
  const { insights, loading, error } = useInsights(token);
  const router = useRouter();
  const isPro = tier === 'pro';

  // Gate: non-pro users see upgrade CTA
  if (!isPro) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Lock size={24} className="text-violet-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Pro шаардлагатай</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Маслоугийн хэрэгцээний шатлалд суурилсан гүнзгий зөвлөмжийг Pro хэрэглэгчид хүртэх боломжтой.
            </p>
          </div>
          <Button
            onClick={() => router.push('/upgrade')}
            className="rounded-2xl px-6"
          >
            <Sparkles size={14} className="mr-2" />
            Pro руу шилжих
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Гүнзгий зөвлөмж</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Маслоугийн шатлалд суурилсан таны дотоод хэрэгцээ
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {loading && <InsightsSkeleton />}

      {!loading && insights.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Sparkles size={32} className="opacity-30" />
          <p className="text-sm">Зөвлөмж байхгүй байна</p>
          <p className="text-xs text-center max-w-xs">
            Илүү олон тэмдэглэл бичснээр таны дотоод хэрэгцээг илүү нарийвчлан тодорхойлно.
          </p>
        </div>
      )}

      {!loading && insights.length > 0 && (
        <ul className="space-y-4">
          {insights.map((insight) => (
            <li
              key={insight.id}
              className="p-5 rounded-2xl bg-card border border-border space-y-2"
            >
              <p className="text-[11px] text-muted-foreground">
                {formatDateShortShort(insight.created_at)}
              </p>
              <p className="text-sm leading-relaxed text-foreground/85">
                {insight.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InsightsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 rounded-2xl bg-muted" />
      ))}
    </div>
  );
}
