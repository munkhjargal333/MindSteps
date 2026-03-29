'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sunrise, BookOpen, BarChart2, Sparkles,
  Network, LogOut, Zap, Lock, Moon, X,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useThoughtContext } from '@/contexts/context';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/home',     label: 'Тэмдэглэл', icon: Zap,       isPro: false },
  { href: '/entries',  label: 'Түүх',       icon: BookOpen,  isPro: false },
  { href: '/insights', label: 'Зөвлөмж',   icon: Sparkles,  isPro: true  },
  { href: '/emotions', label: 'Сэтгэл',    icon: BarChart2, isPro: false },
  { href: '/graph',    label: 'Цэнэ',       icon: Network,   isPro: false },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { tier } = useThoughtContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const userTier = tier === 'pro' ? 'pro' : 'free';


  // Drawer нээлттэй үед scroll хаах
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Avatar үсэг
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name[0].toUpperCase()
    : user?.email?.[0].toUpperCase() ?? 'U';

  // Хэрэглэгчийн нэр
  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Хэрэглэгч';

  return (
    <div className="flex min-h-screen bg-background pb-20 md:pb-0">

      {/* ── Sidebar (Desktop) ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card/40 shrink-0">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b">
          <Sunrise className="w-6 h-6 text-orange-500" />
          <span className="text-lg font-bold">MindSteps</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const locked = item.isPro && userTier === 'free';

            return (
              <Link
                key={item.href}
                href={locked ? '#' : item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted",
                  locked && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon size={18} />
                <span className="flex-1">{item.label}</span>
                {locked && <Lock size={14} className="text-muted-foreground/60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-3">
          <div className="flex items-center justify-between px-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout} className="text-xs text-destructive">
              Гарах
            </Button>
          </div>
          <div className="px-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
              Current Plan:{' '}
              <span className={cn(userTier === 'pro' ? "text-violet-500" : "text-orange-500")}>
                {userTier}
              </span>
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto">

        {/* Mobile topbar — зөвхөн mobile-д харагдана */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-base">MindSteps</span>
          </div>

          {/* Avatar товч — drawer нээнэ */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-border active:opacity-70 transition-opacity shrink-0"
            aria-label="Цэс нээх"
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
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

      {/* ── Bottom Tab Bar (Mobile) ────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-background/80 backdrop-blur-xl border-t flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const locked = item.isPro && userTier === 'free';

          return (
            <Link
              key={item.href}
              href={locked ? '#' : item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                active ? "text-primary" : "text-muted-foreground",
                locked && "opacity-40"
              )}
            >
              <div className="relative">
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
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

      {/* ── Mobile Side Drawer ─────────────────────────────── */}

      {/* Overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-card border-r flex flex-col",
          "transition-transform duration-300 ease-in-out shadow-2xl",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ── Header: хэрэглэгчийн мэдээлэл ── */}
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

          {/* Avatar + нэр + имэйл */}
          <div className="flex items-center gap-3">
            {user?.user_metadata?.avatar_url && !avatarError ? (
             
            <Image
              src={user.user_metadata.avatar_url}
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

          {/* Plan badge */}
          <div className="mt-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                userTier === 'pro'
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                  : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
              )}
            >
              <span>{userTier === 'pro' ? '✦' : '⚡'}</span>
              {userTier} план
            </span>
          </div>
        </div>


          {/* ── Navigation / Upgrade ── */}
        <div className="flex-1 p-3 flex flex-col justify-end">
          {userTier !== 'pro' && (
            <Link
              href="/upgrade"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-semibold shadow-md hover:from-violet-600 hover:to-violet-700 transition-all"
            >
              <Sparkles size={18} />
              <div className="flex-1">
                <p className="leading-none">Pro руу шилжих</p>
                <p className="text-[10px] font-normal text-violet-200 mt-0.5">Бүх боломжийг нээх</p>
              </div>
              <ChevronRight size={16} className="opacity-70" />
            </Link>
          )}
        </div>
        {/* ── Footer: theme toggle + logout ── */}
        <div className="p-3 border-t space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl">
            <Moon size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-muted-foreground">Харанхуй горим</span>
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