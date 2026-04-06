// ─────────────────────────────────────────────────────────────────────────────
// components/ui/button.tsx
// Uses design tokens exclusively — no hardcoded colors.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md text-sm font-medium',
    'transition-all duration-150',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
  ],
  {
    variants: {
      variant: {
        // Primary — orange brand color
        default:
          'bg-primary text-primary-fg hover:bg-primary/90 shadow-sm active:scale-[0.98]',

        // Destructive — red
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',

        // Outlined — surface background, visible border
        outline:
          'border border-border bg-surface text-foreground hover:bg-muted shadow-sm',

        // Secondary — muted background
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',

        // Ghost — transparent, hover reveals background
        ghost:
          'text-foreground hover:bg-muted',

        // Link style
        link:
          'text-primary underline-offset-4 hover:underline p-0 h-auto',

        // Accent / Pro — violet
        accent:
          'bg-accent text-accent-fg hover:bg-accent/90 shadow-sm active:scale-[0.98]',
      },
      size: {
        default:   'h-9 px-4 py-2 has-[>svg]:px-3',
        xs:        'h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*="size-"])]:size-3',
        sm:        'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg:        'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon:      'size-9',
        'icon-xs': 'size-6 rounded-md [&_svg:not([class*="size-"])]:size-3',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
