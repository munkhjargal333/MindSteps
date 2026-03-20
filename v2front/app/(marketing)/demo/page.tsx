'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'
import { ThoughtFlow } from '@/components/thought/ThoughtFlow'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTour } from '@/contexts/TourContext'
import { getDemoRemaining } from '@/lib/api/journalBackend'

export default function DemoPage() {
  const router = useRouter()
  const { startTour, hasSeenTour } = useTour()
  const tourStarted = useRef(false)
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    getDemoRemaining()
      .then((d) => setRemaining(d.remaining))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (tourStarted.current || hasSeenTour('demo')) return
    tourStarted.current = true
    const timer = setTimeout(() => startTour('demo'), 400)
    return () => clearTimeout(timer)
  }, [startTour, hasSeenTour])

  return (
    <div className="min-h-screen bg-background">
      <div data-tour="demo-alert" className="container max-w-md mx-auto pt-4 px-4">
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
            Та туршилтын горимд байна. Өгөгдөл хадгалагдахгүй.
            {remaining !== null && (
              <span className="ml-1 font-semibold">· Үлдсэн {remaining} удаа</span>
            )}
          </AlertDescription>
        </Alert>
      </div>
      <ThoughtFlow
        view="demo"
        onBack={() => router.push('/')}
        onUpgrade={() => router.push('/join')}
      />
    </div>
  )
}
