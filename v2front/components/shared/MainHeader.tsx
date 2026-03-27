import { Sunrise, User, Sparkles, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useThoughtContext } from '@/contexts/context';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainHeader() {
  const { tier } = useThoughtContext();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isLoggedIn = !!user;
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/join');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container max-w-2xl mx-auto h-14 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Sunrise className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
          <span className="text-[17px] font-bold tracking-tight text-foreground">MindSteps</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {tier === 'pro' && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full">
                  <Sparkles size={12} />Pro
                </span>
              )}
              <Link href="/home">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost" size="icon"
                className="rounded-full text-muted-foreground hover:text-destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : !isAuthPage ? (
            <div className="flex items-center gap-2">
              <Button size="sm" asChild className="rounded-xl">
                 <Link href="/login">Нэвтрэх</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}