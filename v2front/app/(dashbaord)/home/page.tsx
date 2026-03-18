'use client';

import { useRouter } from 'next/navigation';
import { ThoughtFlow } from '@/components/thought/ThoughtFlow';

export default function HomePage() {
  const router = useRouter();

  return (
    <ThoughtFlow
      view="home"
      onBack={() => router.back()}
      onUpgrade={() => router.push('/upgrade')}
    />
  );
}