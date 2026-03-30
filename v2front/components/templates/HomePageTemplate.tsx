// ─────────────────────────────────────────────────────────────────────────────
// components/templates/HomePageTemplate.tsx
// TEMPLATE — Dashboard home page layout.
// Composes ActionGrid organism with header copy.
// Manages "which view is showing" UI state (home vs flow).
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ActionGrid } from '@/components/organisms/ActionGrid';
import { ThoughtFlow } from '@/components/organisms/ThoughtFlow';
import type { QuickActionType } from '@/types';

type View = 'home' | 'flow';

export interface HomePageTemplateProps {
  /** "Demo" mode: welcome copy + free actions only, no tier gating */
  demoMode?: boolean;
}

export function HomePageTemplate({ demoMode = false }: HomePageTemplateProps) {
  const router = useRouter();
  const [view, setView] = useState<View>('home');
  const [activeAction, setActiveAction] = useState<QuickActionType | null>(null);
  // Key increments to remount ThoughtFlow and reset internal state
  const [flowKey, setFlowKey] = useState(0);

  const handleSelectAction = useCallback((type: QuickActionType) => {
    setActiveAction(type);
    setView('flow');
  }, []);

  const handleBack = useCallback(() => setView('home'), []);

  const handleComplete = useCallback(() => setView('home'), []);

  const handleReset = useCallback(() => {
    setFlowKey((k) => k + 1);
  }, []);

  const handleUpgrade = useCallback(() => router.push('/upgrade'), [router]);

  if (view === 'flow' && activeAction) {
    return (
      <ThoughtFlow
        key={flowKey}
        initialAction={activeAction}
        onBack={handleBack}
        onComplete={handleComplete}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-8">
      {/* Page header */}
      {demoMode ? (
        <div
          data-tour="demo-welcome"
          className="space-y-2 px-1 text-center sm:text-left"
        >
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-violet-500 font-bold">
            <Sparkles size={14} />
            <span className="text-[10px] uppercase tracking-[0.2em]">
              Ухаалаг тэмдэглэл
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Тавтай морил ✦</h2>
          <p className="text-sm text-muted-foreground italic">
            Өнөөдөр юу мэдэрч байна?
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Өнөөдрийн тусгал
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Дотоод бодлоо цэгцэлье.
          </h1>
        </div>
      )}

      {/* Action grid */}
      <ActionGrid
        onSelectAction={handleSelectAction}
        onUpgrade={handleUpgrade}
        demoMode={demoMode}
      />
    </div>
  );
}
