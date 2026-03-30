// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/layout.tsx  — CLIENT COMPONENT (uses context)
// Wraps all dashboard routes with DashboardLayout template.
// Auth guard: redirects unauthenticated users.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardRouteLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
