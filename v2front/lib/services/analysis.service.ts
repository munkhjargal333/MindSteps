// ─────────────────────────────────────────────────────────────────────────────
// lib/services/analysis.service.ts
// Pure business logic for session analysis.
// Decides routing (authenticated vs demo) and returns a normalized result.
// NO React, NO hooks — called by useJournalFlow hook.
// ─────────────────────────────────────────────────────────────────────────────

import type { SessionData, AnalyzeResult } from '@/types';
import {
  analyzeAuthenticatedSession,
  analyzeDemoSession,
} from './journal.service';

interface AnalysisConfig {
  token: string | null;
}

/**
 * Orchestrates analysis routing:
 * - If token exists → authenticated FastAPI endpoint (saves entry + returns insight)
 * - If no token → demo endpoint (rate-limited, no persistence)
 */
export async function analyzeSession(
  session: SessionData,
  config: AnalysisConfig
): Promise<AnalyzeResult> {
  const payload = {
    surface_text: session.surfaceText,
    inner_reaction_text: session.innerText,
    meaning_text: session.meaningText,
    save_text: true,
  };

  if (config.token) {
    const result = await analyzeAuthenticatedSession(config.token, payload);
    return {
      entryId: result.entry_id,
      insight: result.seed_insight,
    };
  }

  // Demo / unauthenticated path
  const result = await analyzeDemoSession({
    surface_text: payload.surface_text,
    inner_reaction_text: payload.inner_reaction_text,
    meaning_text: payload.meaning_text,
  });

  return {
    entryId: null,
    insight: result.seed_insight,
  };
}
