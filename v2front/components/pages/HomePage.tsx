'use client'

import Link from 'next/link'
import { FREE_ACTIONS, PRO_ACTIONS } from '@/data/constants'
import { ActionGrid } from '@/components/shared/action-grid'
import { useThoughtContext } from '@/contexts/context'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onSelectAction: (type: any) => void
  onUpgrade?: () => void
  // Rate limit props
  usageCount: number
  limit: number
  remaining: number
  isLimited: boolean
  tier: 'demo' | 'free' | 'pro'
}

export function HomePage({
  onSelectAction,
  onUpgrade,
  usageCount,
  limit,
  remaining,
  isLimited,
  tier,
}: Props) {
  const { tier: contextTier } = useThoughtContext()

  const isDemo = tier === 'demo'
  const isPro  = tier === 'pro'
  const isFree = tier === 'free'

  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-8 animate-in fade-in duration-500">

      {/* ── Usage indicator (demo & free) ── */}
      {!isPro && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              Өнөөдрийн ашиглалт
            </p>
            <p className={cn(
              "text-[11px] font-semibold",
              isLimited ? "text-red-500" : "text-muted-foreground"
            )}>
              {isLimited ? "Хязгаарт хүрлээ" : `${remaining} үлдсэн`}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-colors duration-300",
                  i < usageCount
                    ? isLimited ? "bg-red-500" : "bg-orange-500"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── FREE ACTIONS ── */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Асуудлын тэмдэглэл</p>
        <ActionGrid
          actions={FREE_ACTIONS}
          onSelect={onSelectAction}
        />
      </div>

      {/* ── DEMO / FREE / PRO section ── */}
      {isDemo ? (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-background">
                <Lock size={14} className="text-muted-foreground/60" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Илүү гүнзгийрүүлэх үү?</p>
                <p className="text-[11px] text-muted-foreground">
                  Нэвтэрч бүх боломжийг ашигла
                </p>
              </div>
            </div>
            <Link href="/login" className="text-xs font-semibold text-violet-500">
              Нэвтрэх
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <p className={cn(
                "text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md",
                isPro
                  ? "bg-violet-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}>
                {isPro ? 'Pro' : 'Limited'}
              </p>
              <p className="text-xs font-medium text-muted-foreground">Өсөлтийн тэмдэглэл</p>
            </div>
          </div>

          <div className={cn("relative", isFree && "opacity-60 grayscale-[0.5]")}>
            <ActionGrid
              actions={PRO_ACTIONS.slice(0, 4)}
              onSelect={isPro ? onSelectAction : () => {}}
              disabled={!isPro}
            />
            {isFree && (
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={onUpgrade}
                title="Upgrade to unlock"
              />
            )}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <p className="text-[10px] text-center text-muted-foreground/40 pt-4">
        MindSteps v1.0 • Сэтгэл зүйн туслах
      </p>
    </div>
  )
}