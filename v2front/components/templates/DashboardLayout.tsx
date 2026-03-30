// ─────────────────────────────────────────────────────────────────────────────
// components/templates/DashboardLayout.tsx
// TEMPLATE — Full dashboard shell: sidebar (desktop) + bottom nav (mobile)
//            + side drawer (mobile).
// All state (drawer open, avatar error) is UI-only — appropriate here.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import {
  Sunrise, BookOpen, BarChart2, Sparkles,
  Network, LogOut, Zap, Lock, Moon, X, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { TierPill } from '@/components/atoms/TierPill';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useThoughtContext } from '@/contexts/TierContext';
import type { NavItem } from '@/types';

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { href: '/home',     label: 'Тэмдэглэл', isPro: false },
  { href: '/entries',  label: 'Түүх',       isPro: false },
  { href: '/insights', label: 'Зөвлөмж',   isPro: true  },
  { href: '/emotions', label: 'Сэтгэл',    isPro: false },
  { href: '/graph',    label: 'Цэнэ',       isPro: false },
];

const NAV_ICONS = {
  '/home':     Zap,
  '/entries':  BookOpen,
  '/insights': Sparkles,
  '/emotions': BarChart2,
  '/graph':    Network,
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { tier } = useThoughtContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const isPro = tier === 'pro';

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Derived user info
  const initials =
    user?.user_metadata?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    'U';

  const displayName =
    user?.user_metadata?.full_name ??
    user?.email?.split('@')[0] ??
    'Хэрэглэгч';

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="flex min-h-screen bg-background pb-20 md:pb-0">

      {/* ── Desktop Sidebar ───────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card/40 shrink-0">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b">
          <Sunrise className="w-6 h-6 text-orange-500" />
          <span className="text-lg font-bold">MindSteps</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS];
            const active = pathname === item.href;
            const locked = item.isPro && !isPro;

            return (
              <Link
                key={item.href}
                href={locked ? '#' : item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                  active
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:bg-muted',
                  locked && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {locked && <Lock size={14} className="text-muted-foreground/60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-3">
          <div className="flex items-center justify-between px-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-xs text-destructive"
            >
              Гарах
            </Button>
          </div>
          <div className="px-2">
            <TierPill tier={tier} />
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-base">MindSteps</span>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-border active:opacity-70 transition-opacity shrink-0"
            aria-label="Цэс нээх"
          >
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                {initials}
              </div>
            )}
          </button>
        </div>

        {children}
      </main>

      {/* ── Mobile Bottom Tab Bar ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-background/80 backdrop-blur-xl border-t flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS];
          const active = pathname === item.href;
          const locked = item.isPro && !isPro;

          return (
            <Link
              key={item.href}
              href={locked ? '#' : item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all',
                active ? 'text-primary' : 'text-muted-foreground',
                locked && 'opacity-40'
              )}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {locked && (
                  <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
                    <Lock size={10} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Mobile Side Drawer overlay ────────────────────────── */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── Mobile Side Drawer panel ──────────────────────────── */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-card border-r flex flex-col',
          'transition-transform duration-300 ease-in-out shadow-2xl',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-5 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-sm">MindSteps</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label="Хаах"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            {avatarUrl && !avatarError ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={48}
                height={48}
                className="rounded-full object-cover ring-2 ring-border"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <div className="mt-3">
            <TierPill tier={tier} />
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="flex-1 p-3 flex flex-col justify-end">
          {!isPro && (
            <Link
              href="/upgrade"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-semibold shadow-md hover:from-violet-600 hover:to-violet-700 transition-all"
            >
              <Sparkles size={18} />
              <div className="flex-1">
                <p className="leading-none">Pro руу шилжих</p>
                <p className="text-[10px] font-normal text-violet-200 mt-0.5">
                  Бүх боломжийг нээх
                </p>
              </div>
              <ChevronRight size={16} className="opacity-70" />
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl">
            <Moon size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-muted-foreground">
              Харанхуй горим
            </span>
            <ThemeToggle />
          </div>
          <button
            onClick={() => { setDrawerOpen(false); logout(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut size={18} />
            <span>Гарах</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
