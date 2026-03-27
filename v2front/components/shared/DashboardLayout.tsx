'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Sunrise, BookOpen, BarChart2, Sparkles, 
  Network, LogOut, Zap, Lock 
} from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useThoughtContext } from '@/contexts/context';

// Зөвхөн Free болон Pro гэж хязгаарлахын тулд permissions-ийг энд тохируулж болно
const NAV_ITEMS = [
  { href: '/home',     label:  'Тэмдэглэл',      icon: Zap,        isPro: false },
  { href: '/entries',   label: 'Түүх',     icon: BookOpen,   isPro: false },
  { href: '/insights',  label: 'Паттерн',   icon: Sparkles,   isPro: true  },
  { href: '/emotions',  label: 'Сэтгэл',    icon: BarChart2,  isPro: true  },
  { href: '/graph',     label: 'Цэнэ',      icon: Network,    isPro: true  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { tier } = useThoughtContext();
  
  // Demo-г Free гэж үзэж логикоо хялбарчлах
  const userTier = tier === 'pro' ? 'pro' : 'free';

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
                  active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted",
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
               Current Plan: <span className={cn(userTier === 'pro' ? "text-violet-500" : "text-orange-500")}>{userTier}</span>
             </p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
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
    </div>
  );
}