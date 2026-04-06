'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/organisms/MainHeader.tsx
// ORGANISM — Top navigation bar (marketing + public pages).
// REFACTORED: Uses design tokens. Removed violet-100/900 hardcoded values.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sunrise, User, Sparkles, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useThoughtContext } from '@/contexts/TierContext';

export function MainHeader() {
  const { user, logout } = useAuth();
  const { tier } = useThoughtContext();
  const pathname = usePathname();

  const isLoggedIn = !!user;
  const isAuthPage =
    pathname?.startsWith('/login') || pathname?.startsWith('/join');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container max-w-2xl mx-auto h-14 flex items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Sunrise className="w-6 h-6 text-primary" strokeWidth={2.5} />
          <span className="text-[17px] font-bold tracking-tight text-foreground">
            MindSteps
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {tier === 'pro' && (
                // Uses accent token instead of violet-100/violet-900
                <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-accent/15 text-accent px-2 py-1 rounded-full font-medium">
                  <Sparkles size={12} />
                  Pro
                </span>
              )}
              <Link href="/home">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : !isAuthPage ? (
            <Button size="sm" asChild className="rounded-xl">
              <Link href="/login">Нэвтрэх</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
