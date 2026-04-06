// ─────────────────────────────────────────────────────────────────────────────
// components/ui/input.tsx
// Token-based input — no hardcoded colors.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout & sizing
        'h-9 w-full min-w-0 rounded-md px-3 py-1 text-base md:text-sm',
        // Tokens: background, text, border
        'bg-surface text-foreground border border-input',
        'placeholder:text-muted-foreground',
        'selection:bg-primary/20 selection:text-foreground',
        // Shadow & transition
        'shadow-xs transition-[color,box-shadow,border-color]',
        // Focus ring
        'outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40',
        // File input
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // Validation
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
