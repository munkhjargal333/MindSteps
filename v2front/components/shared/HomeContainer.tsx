'use client'

import { useState } from 'react'
import { HomePage } from '@/components/pages/HomePage'
import { ThoughtFlow } from '@/components/thought/ThoughtFlow'
import type { QuickActionType } from '@/types/types'

type View = 'home' | 'flow'

export function HomeContainer() {
  const [view, setView] = useState<View>('home')
  const [selectedAction, setSelectedAction] = useState<QuickActionType | null>(null)

  function handleSelectAction(type: QuickActionType) {
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
        <HomePage onSelectAction={handleSelectAction} />
      )}

      {view === 'flow' && selectedAction && (
        <ThoughtFlow
          initialAction={selectedAction}
          onBack={handleBack}
        />
      )}
    </>
  )
}