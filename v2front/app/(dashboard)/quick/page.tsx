'use client'

import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'
import { ThoughtFlow } from '@/components/thought/ThoughtFlow'
import { DashboardLayout } from '@/components/shared/DashboardLayout'
import { useTour } from '@/contexts/TourContext'

export default function QuickPage() {
  const router = useRouter()
  const { startTour, hasSeenTour } = useTour()
  const tourStarted = useRef(false)

  useEffect(() => {
    if (tourStarted.current || hasSeenTour('quick')) return
    tourStarted.current = true
    const timer = setTimeout(() => startTour('quick'), 400)
    return () => clearTimeout(timer)
  }, [startTour, hasSeenTour])

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        <ThoughtFlow
          view="quick"
          onBack={() => router.push('/quick')}
          onUpgrade={() => router.push('/join')}
        />
      </div>
    </DashboardLayout>
  )
}
