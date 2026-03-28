/**
 * Journal Backend API Client
 * Connects to the new backend: NEXT_PUBLIC_API_BASE
 * All endpoints follow the OpenAPI spec.
 */

const getBase = () =>
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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SeedInsightData {
  mirror: string;
  reframe: string;
  relief: string;
  summary: string;
}

export interface EntryCreateRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
  save_text?: boolean;
}

export interface EntryCreateResponse {
  entry_id: string;
  seed_insight: SeedInsightData;
  analysis_channel: string;
}

export interface EntryResponse {
  id: string;
  user_id: string;
  surface_text: string | null;
  inner_reaction_text: string | null;
  meaning_text: string | null;
  is_encrypted: boolean;
  is_text_saved: boolean;
  entry_index: number;
  created_at: string;
}

export interface PaginatedEntryResponse {
  items: EntryResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface DemoRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
}

export interface DemoResponse {
  seed_insight: SeedInsightData;
  remaining: number;
  note: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  [key: string]: unknown;
}

export interface LlmConfig {
  model?: string;
  provider?: string;
  [key: string]: unknown;
}

export interface AdminStats {
  total_users?: number;
  total_entries?: number;
  [key: string]: unknown;
}

export interface EmotionStat {
    emotion:    string,
    score_sum:  number,
    count:      number,
    percentage: number,
}

export interface GraphData {
  nodes: { id: string; label: string; [key: string]: unknown }[];
  edges: { source: string; target: string; [key: string]: unknown }[];
  [key: string]: unknown;
}

export interface DeepInsight {
  id: string;
  content: string;
  created_at: string;
  [key: string]: unknown;
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
): Promise<PaginatedEntryResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.page_size) query.set('page_size', String(params.page_size));
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${getBase()}/api/entries/?${query}`, {
    headers: authHeaders(token),
  });
  return handleResponse<PaginatedEntryResponse>(res);
}

export async function getEntry(token: string, entryId: string): Promise<EntryResponse> {
  const res = await fetch(`${getBase()}/api/entries/${entryId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<EntryResponse>(res);
}

export async function deleteEntry(token: string, entryId: string): Promise<void> {
  const res = await fetch(`${getBase()}/api/entries/${entryId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

// ─── Graph & Insights ─────────────────────────────────────────────────────────

export async function getValueGraph(token: string): Promise<GraphData> {
  const res = await fetch(`${getBase()}/api/graph`, {
    headers: authHeaders(token),
  });
  return handleResponse<GraphData>(res);
}

export async function listDeepInsights(token: string): Promise<DeepInsight[]> {
  const res = await fetch(`${getBase()}/api/insights/deep`, {
    headers: authHeaders(token),
  });
  return handleResponse<DeepInsight[]>(res);
}

export async function getSeedInsight(token: string, entryId: string): Promise<SeedInsightData> {
  const res = await fetch(`${getBase()}/api/insights/seed/${entryId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<SeedInsightData>(res);
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getEmotionStats(
  token: string,
  days = 30
): Promise<EmotionStat[]> {
  const res = await fetch(`${getBase()}/api/stats/emotions?days=${days}`, {
    headers: authHeaders(token),
  });
  return handleResponse<EmotionStat[]>(res);
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export async function demoSeedInsight(payload: DemoRequest): Promise<DemoResponse> {
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

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function adminListUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${getBase()}/api/admin/users`, {
    headers: authHeaders(token),
  });
  return handleResponse<AdminUser[]>(res);
}

export async function adminInviteUser(
  token: string,
  email: string
): Promise<unknown> {
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

export async function adminGetLlmConfig(token: string): Promise<LlmConfig> {
  const res = await fetch(`${getBase()}/api/admin/llm/config`, {
    headers: authHeaders(token),
  });
  return handleResponse<LlmConfig>(res);
}

export async function adminTestLlm(token: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${getBase()}/api/admin/llm/test`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  return handleResponse<{ ok: boolean; message?: string }>(res);
}

export async function adminGetStats(token: string): Promise<AdminStats> {
  const res = await fetch(`${getBase()}/api/admin/stats`, {
    headers: authHeaders(token),
  });
  return handleResponse<AdminStats>(res);
}
