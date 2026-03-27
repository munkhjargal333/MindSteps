import type { SessionData, SeedInsight } from '../../types/types';
import type { ThoughtContextValue } from '@/contexts/context';
import { createEntry, demoSeedInsight } from './journalBackend';

// ─── Result ───────────────────────────────────────────────────

export interface AnalyzeResult {
  entryId: string | null;
  insight: SeedInsight & { summary?: string };
}

// ─── Main entry point ─────────────────────────────────────────
// Authenticated → POST /api/entries/
// Demo (no token) → POST /api/demo/seed-insight

export async function analyzeSession(
  session: SessionData,
  config: ThoughtContextValue,
): Promise<AnalyzeResult> {
  if (config.token) {
    const result = await createEntry(config.token, {
      surface_text: session.surfaceText,
      inner_reaction_text: session.innerText,
      meaning_text: session.meaningText,
      save_text: true,
    });
    return {
      entryId: result.entry_id,
      insight: result.seed_insight,
    };
  }

  // Demo / unauthenticated
  const result = await demoSeedInsight({
    surface_text: session.surfaceText,
    inner_reaction_text: session.innerText,
    meaning_text: session.meaningText,
  });
  
  return {
    entryId: null,
    insight: result.seed_insight,
  };
}