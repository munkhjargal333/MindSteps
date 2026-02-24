import { Sunrise, LogIn, User, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useThoughtContext } from '@/components/thought/context';

export function MainHeader() {
  const { tier } = useThoughtContext(); // user object байгаа гэж үзье
  const isLoggedIn = !!tier; // эсвэл tier байгаа эсэхээр шалгаж болно

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container max-w-2xl mx-auto h-14 flex items-center justify-between px-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 group cursor-pointer transition-opacity hover:opacity-80">
          <Sunrise className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
          <span className="text-[17px] font-bold tracking-tight text-foreground">
            MindSteps
          </span>
        </div>

        {/* Right side: ThemeToggle + Auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {isLoggedIn ? (
            // Хэрэглэч нэвтэрсэн бол profile dropdown эсвэл user icon
            <div className="flex items-center gap-2">
              {tier === 'pro' && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full">
                  <Sparkles size={12} />
                  Pro
                </span>
              )}
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            // Нэвтрээгүй бол login/signup товч
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/login">Нэвтрэх</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/signup">Бүртгүүлэх</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}