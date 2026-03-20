'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sunrise,
  BookOpen,
  BarChart2,
  Sparkles,
  Network,
  Settings,
  LogOut,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { href: '/quick',     label: 'Тэмдэглэл',   icon: Zap        },
  { href: '/entries',   label: 'Бичлэгүүд',   icon: BookOpen   },
  { href: '/insights',  label: 'Insight',      icon: Sparkles   },
  { href: '/emotions',  label: 'Сэтгэл',       icon: BarChart2  },
  { href: '/graph',     label: 'Граф',         icon: Network    },
] as const;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 border-r bg-card/40 shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b">
          <Sunrise className="w-5 h-5 text-orange-500" strokeWidth={2.5} />
          <span className="text-[16px] font-bold tracking-tight">MindSteps</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname.startsWith('/admin')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              <Settings size={16} />
              Админ
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t space-y-1">
          <div className="flex items-center justify-between px-3 py-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive gap-2"
            >
              <LogOut size={14} />
              <span className="text-xs">Гарах</span>
            </Button>
          </div>
          {user?.email && (
            <p className="text-[11px] text-muted-foreground/60 px-3 truncate">{user.email}</p>
          )}
        </div>
      </aside>

      {/* ── Mobile header ─────────────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Sunrise className="w-5 h-5 text-orange-500" strokeWidth={2.5} />
          <span className="text-[16px] font-bold tracking-tight">MindSteps</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-xl"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* ── Mobile nav drawer ─────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <nav
            className="absolute top-14 inset-x-0 bg-card border-b shadow-lg px-4 py-3 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60"
              >
                <Settings size={16} />
                Админ
              </Link>
            )}
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              >
                <LogOut size={16} />
                Гарах
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────── */}
      <main className="flex-1 min-w-0 md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
