'use client'

import { useRouter } from 'next/navigation'
import { ThoughtFlow } from '@/components/thought/ThoughtFlow'
import { DashboardLayout } from '@/components/shared/DashboardLayout'

export default function HomePage() {
  const router = useRouter()

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        <ThoughtFlow
          view="home"
          onBack={() => router.push('/quick')}
          onUpgrade={() => router.push('/join')}
        />
      </div>
    </DashboardLayout>
  )
}
