'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/atoms/ThemeToggle.tsx
// ATOM — Accessible sun/moon toggle. No business logic.
// Uses design tokens only; no hardcoded colors.
// ─────────────────────────────────────────────────────────────────────────────

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  className?: string;
  /** 'icon' (default) shows just the icon. 'labeled' shows icon + text. */
  variant?: 'icon' | 'labeled';
}

export function ThemeToggle({ className, variant = 'icon' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch — render placeholder until mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  // Render a ghost placeholder during SSR to avoid layout shift
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn('rounded-full opacity-0', className)}
        aria-hidden
      />
    );
  }

  if (variant === 'labeled') {
    return (
      <button
        onClick={toggle}
        className={cn(
          'flex items-center gap-3 w-full px-4 py-2.5 rounded-xl',
          'text-sm font-medium text-foreground',
          'hover:bg-muted transition-colors',
          className
        )}
        aria-label={isDark ? 'Цайвар горим руу шилжих' : 'Харанхуй горим руу шилжих'}
      >
        {isDark ? (
          <Sun size={16} className="text-muted-foreground shrink-0" />
        ) : (
          <Moon size={16} className="text-muted-foreground shrink-0" />
        )}
        <span className="flex-1 text-left text-muted-foreground">
          {isDark ? 'Цайвар горим' : 'Харанхуй горим'}
        </span>
        {/* Visual indicator of current state */}
        <div
          className={cn(
            'w-8 h-4 rounded-full transition-colors relative shrink-0',
            isDark ? 'bg-primary' : 'bg-muted'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-3 h-3 rounded-full bg-primary-fg transition-transform',
              isDark ? 'translate-x-4' : 'translate-x-0.5'
            )}
          />
        </div>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-full relative overflow-hidden', className)}
      onClick={toggle}
      aria-label={isDark ? 'Цайвар горим руу шилжих' : 'Харанхуй горим руу шилжих'}
    >
      {/* Sun icon — visible in dark mode */}
      <Sun
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0'
        )}
      />
      {/* Moon icon — visible in light mode */}
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          isDark
            ? '-rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        )}
      />
    </Button>
  );
}
