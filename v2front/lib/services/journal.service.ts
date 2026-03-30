// ─────────────────────────────────────────────────────────────────────────────
// lib/services/journal.service.ts
// Pure service layer — NO React, NO hooks, NO UI.
// Responsible ONLY for HTTP communication with the backend API.
// All types come from the centralized /types/index.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  JournalEntry,
  PaginatedEntries,
  SeedInsight,
  EmotionStat,
  GraphData,
  DeepInsight,
} from '@/types';

// ─── Internal helpers ─────────────────────────────────────────────────────────

const getBase = (): string =>
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  'http://localhost:8000';

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const message =
      typeof body?.detail === 'string'
        ? body.detail
        : Array.isArray(body?.detail)
        ? body.detail.map((e: { msg: string }) => e.msg).join(', ')
        : `HTTP ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ─── Request / Response shapes (internal to service) ─────────────────────────

interface EntryCreateRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
  save_text?: boolean;
}

interface EntryCreateResponse {
  entry_id: string;
  seed_insight: SeedInsight & { summary: string };
  analysis_channel: string;
}

interface DemoRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
}

interface DemoResponse {
  seed_insight: SeedInsight & { summary: string };
  remaining: number;
  note: string;
}

// ─── Entries ──────────────────────────────────────────────────────────────────

export async function createEntry(
  token: string,
  payload: EntryCreateRequest
): Promise<EntryCreateResponse> {
  const res = await fetch(`${getBase()}/api/entries/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<EntryCreateResponse>(res);
}

export async function listEntries(
  token: string,
  params?: { page?: number; page_size?: number; search?: string }
): Promise<PaginatedEntries> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.page_size) query.set('page_size', String(params.page_size));
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${getBase()}/api/entries/?${query}`, {
    headers: authHeaders(token),
  });
  return handleResponse<PaginatedEntries>(res);
}

export async function getEntry(token: string, entryId: string): Promise<JournalEntry> {
  const res = await fetch(`${getBase()}/api/entries/${entryId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<JournalEntry>(res);
}

export async function deleteEntry(token: string, entryId: string): Promise<void> {
  const res = await fetch(`${getBase()}/api/entries/${entryId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

export async function analyzeAuthenticatedSession(
  token: string,
  payload: EntryCreateRequest
): Promise<EntryCreateResponse> {
  return createEntry(token, payload);
}

export async function analyzeDemoSession(payload: DemoRequest): Promise<DemoResponse> {
  const res = await fetch(`${getBase()}/api/demo/seed-insight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<DemoResponse>(res);
}

export async function getDemoRemaining(): Promise<{ remaining: number }> {
  const res = await fetch(`${getBase()}/api/demo/remaining`);
  return handleResponse<{ remaining: number }>(res);
}

// ─── Stats & Graph ────────────────────────────────────────────────────────────

export async function getEmotionStats(token: string, days = 30): Promise<EmotionStat[]> {
  const res = await fetch(`${getBase()}/api/stats/emotions?days=${days}`, {
    headers: authHeaders(token),
  });
  return handleResponse<EmotionStat[]>(res);
}

export async function getValueGraph(token: string): Promise<GraphData> {
  const res = await fetch(`${getBase()}/api/graph`, {
    headers: authHeaders(token),
  });
  return handleResponse<GraphData>(res);
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export async function listDeepInsights(token: string): Promise<DeepInsight[]> {
  const res = await fetch(`${getBase()}/api/insights/deep`, {
    headers: authHeaders(token),
  });
  return handleResponse<DeepInsight[]>(res);
}

export async function getSeedInsight(
  token: string,
  entryId: string
): Promise<SeedInsight & { summary: string }> {
  const res = await fetch(`${getBase()}/api/insights/seed/${entryId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<SeedInsight & { summary: string }>(res);
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  [key: string]: unknown;
}

export interface AdminStats {
  total_users?: number;
  total_entries?: number;
  [key: string]: unknown;
}

export async function adminListUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${getBase()}/api/admin/users`, {
    headers: authHeaders(token),
  });
  return handleResponse<AdminUser[]>(res);
}

export async function adminInviteUser(token: string, email: string): Promise<unknown> {
  const res = await fetch(`${getBase()}/api/admin/users/invite`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ email }),
  });
  return handleResponse<unknown>(res);
}

export async function adminDeleteUser(token: string, userId: string): Promise<void> {
  const res = await fetch(`${getBase()}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

export async function adminGetStats(token: string): Promise<AdminStats> {
  const res = await fetch(`${getBase()}/api/admin/stats`, {
    headers: authHeaders(token),
  });
  return handleResponse<AdminStats>(res);
}
