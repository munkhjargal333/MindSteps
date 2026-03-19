'use client';

import { useRouter } from 'next/navigation';
import { ThoughtFlow } from '@/components/thought/ThoughtFlow';

export default function QuickPage() {
  const router = useRouter();

  return (
    <ThoughtFlow
      view="quick"
      onBack={() => router.back()}
      onUpgrade={() => router.push('/upgrade')}
    />
  );
}