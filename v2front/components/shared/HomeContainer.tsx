'use client'

import { useState } from 'react'
import { HomePage } from '@/components/pages/HomePage'
import { ThoughtFlow } from '@/components/thought/ThoughtFlow'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { useAuth } from '@/contexts/AuthContext'
import { useThoughtContext } from '@/contexts/context'
import type { QuickActionType } from '@/types/types'
import { Zap, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type View = 'home' | 'flow'

export function HomeContainer() {
  const [view, setView] = useState<View>('home')
  const [selectedAction, setSelectedAction] = useState<QuickActionType | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

  const { user } = useAuth()
  const { tier } = useThoughtContext()

  const userId = user?.id ?? 'guest'
  const userTier = tier === 'pro' ? 'pro' : tier === 'demo' ? 'demo' : 'free'

  const { usageCount, limit, remaining, isLimited, increment } = useRateLimit(userId, userTier)

  function handleSelectAction(type: QuickActionType) {
    // Pro бол шууд нэвтрүүлнэ
    if (userTier === 'pro') {
      setSelectedAction(type)
      setView('flow')
      return
    }

    // Хязгаар шалгана
    const allowed = increment()

    if (!allowed) {
      setShowLimitModal(true)
      return
    }

    setSelectedAction(type)
    setView('flow')
  }

  function handleBack() {
    setView('home')
    setSelectedAction(null)
  }

  return (
    <>
      {view === 'home' && (
        <HomePage
          onSelectAction={handleSelectAction}
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
          tier={userTier}
        />
      )}

      {view === 'flow' && selectedAction && (
        <ThoughtFlow
          initialAction={selectedAction}
          onBack={handleBack}
        />
      )}

      {/* ── Хязгаарт хүрсэн Modal ── */}
      {showLimitModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLimitModal(false)}
        >
          <div
            className="w-full max-w-sm bg-card rounded-3xl p-6 shadow-2xl border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Хаах товч */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Zap size={32} className="text-orange-500" />
              </div>
            </div>

            {/* Текст */}
            <h2 className="text-xl font-bold text-center mb-2">
              Өдрийн хязгаарт хүрлээ
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {userTier === 'demo'
                ? `Demo хэрэглэгч өдөрт ${limit} удаа ашиглах боломжтой. Бүртгүүлж нэмэлт боломж нээ.`
                : `Free хэрэглэгч өдөрт ${limit} удаа ашиглах боломжтой. Маргааш дахин ашиглах боломжтой.`
              }
            </p>

            {/* Usage indicator */}
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: limit }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-colors",
                    i < usageCount
                      ? "bg-orange-500"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Товчнууд */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowLimitModal(false)
                  // TODO: upgrade page руу шилжүүлэх
                  // router.push('/upgrade')
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm transition-all active:scale-95"
              >
                <Sparkles size={16} />
                Pro болох — хязгааргүй ашиглах
              </button>

              {userTier === 'demo' && (
                <button
                  onClick={() => {
                    setShowLimitModal(false)
                    // TODO: signup page руу шилжүүлэх
                    // router.push('/signup')
                  }}
                  className="w-full py-3 px-4 rounded-2xl border font-medium text-sm text-muted-foreground hover:bg-muted transition-all"
                >
                  Үнэгүй бүртгүүлэх (өдөрт {5} удаа)
                </button>
              )}

              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-3 px-4 rounded-2xl text-sm text-muted-foreground hover:bg-muted transition-all"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}