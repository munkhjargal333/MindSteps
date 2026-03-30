// ─────────────────────────────────────────────────────────────────────────────
// app/(marketing)/demo/page.tsx  — SERVER COMPONENT
// Public demo page — no auth required.
// Uses HomePageTemplate in demoMode (free actions only, welcome copy).
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from 'react';
import { HomePageTemplate } from '@/components/templates/HomePageTemplate';

export default function DemoPage() {
  return (
    <Suspense fallback={<DemoSkeleton />}>
      <HomePageTemplate demoMode />
    </Suspense>
  );
}

function DemoSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-8 animate-pulse">
      <div className="space-y-2 text-center">
        <div className="h-3 w-40 bg-muted rounded mx-auto" />
        <div className="h-8 w-48 bg-muted rounded mx-auto" />
        <div className="h-4 w-36 bg-muted rounded mx-auto" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 rounded-[2.5rem] bg-muted" />
        ))}
      </div>
    </div>
  );
}
