import type { SessionData, SeedInsight, JournalEntry } from './types';
import { ACTION_LABELS } from './constants';

// ─── Config ───────────────────────────────────────────────────

export interface ApiConfig {
  apiBase?: string;
  token?: string;
}

// ─── Request/Response types (backend contract) ────────────────

interface InsightRequest {
  action_type: string;
  surface_text: string;
  body_felt?: string;
  first_reaction?: string;
  what_matters?: string;
  conflict?: string;
}

interface InsightResponse {
  mirror: string;
  reframe: string;
  relief: string;
  entry_id: number | null;
}

export interface AnalyzeResult {
  entryId: number | null;
  insight: SeedInsight;
}

// ─── Single backend call ──────────────────────────────────────
// AI key frontend-д байхгүй — бүгд backend-аар дамжина

export async function analyzeSession(
  session: SessionData,
  config: ApiConfig,
): Promise<AnalyzeResult> {
  const base = config.apiBase ?? 'http://localhost:8000';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (config.token) {
    headers['Authorization'] = `Bearer ${config.token}`;
  }

  const body: InsightRequest = {
    action_type:    session.actionType,
    surface_text:   session.surfaceText,
    body_felt:      session.bodyFelt      || undefined,
    first_reaction: session.firstReaction || undefined,
    what_matters:   session.whatMatters   || undefined,
    conflict:       session.conflict      || undefined,
  };

  const res = await fetch(`${base}/journal/insight`, {
    method:  'POST',
    headers,
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? `Server error ${res.status}`);
  }

  const data: InsightResponse = await res.json();

  return {
    entryId: data.entry_id,
    insight: {
      mirror:  data.mirror,
      reframe: data.reframe,
      relief:  data.relief,
    },
  };
}
