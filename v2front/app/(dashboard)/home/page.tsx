// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/home/page.tsx  — SERVER COMPONENT
// Fetches nothing (client-side data). Renders HomePageTemplate directly.
// Suspense boundary wraps any async children.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from 'react';
import { HomePageTemplate } from '@/components/templates/HomePageTemplate';

export default function DashboardHomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageTemplate />
    </Suspense>
  );
}

function HomePageSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-32 bg-muted rounded" />
        <div className="h-8 w-56 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 rounded-[2.5rem] bg-muted" />
        ))}
      </div>
    </div>
  );
}
