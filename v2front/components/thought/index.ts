// ─────────────────────────────────────────────────────────────────────────────
// components/thought/index.ts
// Backward-compatibility barrel — consumers can still import from here.
// This is a SHIM only. In new code, import directly from the canonical paths.
// ─────────────────────────────────────────────────────────────────────────────

// Organisms
export { ThoughtFlow }   from '@/components/organisms/ThoughtFlow';
export { ActionGrid }    from '@/components/organisms/ActionGrid';

// Templates
export { HomePageTemplate as HomePage } from '@/components/templates/HomePageTemplate';

// Contexts (canonical)
export { TierProvider as ThoughtProvider, useThoughtContext } from '@/contexts/TierContext';

// Feature hook (canonical)
export { useJournalFlow as useThoughtFlow } from '@/features/journal/hooks/useJournalFlow';

// Types
export type { QuickActionType, SessionData, SeedInsight, Tier } from '@/types';
