import type { SessionData, SeedInsight } from '../../../types/types';
// ─── Config ───────────────────────────────────────────────────

export interface ApiConfig {
  apiBase?: string;
  token?: string;
}

// ─── Request/Response types (backend contract) ────────────────

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

interface InsightRequest {
  user_id?: number; // Optional, backend can infer from token
  session: SessionData;
}

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
    session
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
