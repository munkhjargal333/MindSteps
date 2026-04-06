// ─────────────────────────────────────────────────────────────────────────────
// tailwind.config.ts — Token-driven Tailwind configuration
// All colors reference CSS variables so they respond to dark/light mode.
// Pattern: rgb(var(--token) / <alpha-value>)  ← enables opacity modifiers
// ─────────────────────────────────────────────────────────────────────────────

import type { Config } from 'tailwindcss';

const config: Config = {
  // ── Dark mode: class strategy (controlled by next-themes) ──────────────────
  darkMode: 'class',

  // ── Content paths ──────────────────────────────────────────────────────────
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      // ── Color tokens ─────────────────────────────────────────────────────
      colors: {
        // Base surfaces
        background:  'rgb(var(--background) / <alpha-value>)',
        foreground:  'rgb(var(--foreground) / <alpha-value>)',
        surface:     'rgb(var(--surface)    / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2)  / <alpha-value>)',

        // Brand
        primary: {
          DEFAULT: 'rgb(var(--primary)    / <alpha-value>)',
          fg:      'rgb(var(--primary-fg) / <alpha-value>)',
          foreground: 'rgb(var(--primary-fg) / <alpha-value>)',
        },

        // Accent
        accent: {
          DEFAULT: 'rgb(var(--accent)    / <alpha-value>)',
          fg:      'rgb(var(--accent-fg) / <alpha-value>)',
          foreground: 'rgb(var(--accent-fg) / <alpha-value>)',
        },

        // Semantic utility
        muted: {
          DEFAULT:    'rgb(var(--muted)    / <alpha-value>)',
          foreground: 'rgb(var(--muted-fg) / <alpha-value>)',
        },

        // Borders & inputs
        border: 'rgb(var(--border) / <alpha-value>)',
        input:  'rgb(var(--input)  / <alpha-value>)',
        ring:   'rgb(var(--ring)   / <alpha-value>)',

        // Status
        destructive: {
          DEFAULT:    'rgb(var(--destructive)    / <alpha-value>)',
          foreground: 'rgb(var(--destructive-fg) / <alpha-value>)',
        },
        success: {
          DEFAULT:    'rgb(var(--success)    / <alpha-value>)',
          foreground: 'rgb(var(--success-fg) / <alpha-value>)',
        },

        // Overlay (for modals, backdrops)
        overlay: 'rgb(var(--overlay) / <alpha-value>)',

        // shadcn/ui aliases (keep for compatibility)
        card: {
          DEFAULT:    'rgb(var(--card)    / <alpha-value>)',
          foreground: 'rgb(var(--card-fg) / <alpha-value>)',
        },
        popover: {
          DEFAULT:    'rgb(var(--popover)    / <alpha-value>)',
          foreground: 'rgb(var(--popover-fg) / <alpha-value>)',
        },
        secondary: {
          DEFAULT:    'rgb(var(--secondary)    / <alpha-value>)',
          foreground: 'rgb(var(--secondary-fg) / <alpha-value>)',
        },
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ── Font family ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },

      // ── Keyframes ────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to:   { opacity: '0', transform: 'translateY(4px)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in':       'fade-in 200ms ease forwards',
        'fade-out':      'fade-out 200ms ease forwards',
        'slide-in':      'slide-in-right 300ms ease forwards',
        'spin-slow':     'spin-slow 2s linear infinite',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config;
