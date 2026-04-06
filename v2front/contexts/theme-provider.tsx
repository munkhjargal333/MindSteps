'use client';

// ─────────────────────────────────────────────────────────────────────────────
// contexts/theme-provider.tsx
// Thin wrapper around next-themes with our project defaults baked in.
// Import ThemeProvider from here — not directly from next-themes.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"      // Adds/removes `class="dark"` on <html>
      defaultTheme="dark"    // First-visit default
      enableSystem={false}   // Ignore OS preference — user has full control
      disableTransitionOnChange={false} // We handle transitions in CSS
      storageKey="mindsteps-theme"      // localStorage key
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
