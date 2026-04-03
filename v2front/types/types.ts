// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts
// Single source of truth for ALL domain types.
// Import from here everywhere — never from scattered local files.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    tier?: Tier;
  };
}

// ─── Tier / Subscription ──────────────────────────────────────────────────────
export type Tier = 'demo' | 'free' | 'pro';

// ─── Quick Actions ─────────────────────────────────────────────────────────────
export type QuickActionType =
  | 'stress'
  | 'loneliness'
  | 'gratitude'
  | 'self_doubt'
  | 'purpose'
  | 'values'
  | 'fear'
  | 'joy';

// ─── Thought Flow ─────────────────────────────────────────────────────────────
export type FlowStep = 1 | 2 | 3 | 4;

export interface SessionData {
  actionType: QuickActionType;
  surfaceText: string;
  innerText: string;
  meaningText: string;
}

// ─── Insight ──────────────────────────────────────────────────────────────────
export interface SeedInsight {
  mirror: string;
  reframe: string;
  relief: string;
  summary?: string;
}

export interface AnalyzeResult {
  entryId: string | null;
  insight: SeedInsight;
}

// ─── Journal Entries ──────────────────────────────────────────────────────────
export interface JournalEntry {
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

export interface PaginatedEntries {
  items: JournalEntry[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Emotions / Stats ─────────────────────────────────────────────────────────
export interface EmotionStat {
  emotion: string;
  score_sum: number;
  count: number;
  percentage: number;
}

// ─── Graph ────────────────────────────────────────────────────────────────────
export interface GraphNode {
  id: string;
  label: string;
  [key: string]: unknown;
}

export interface GraphEdge {
  source: string;
  target: string;
  [key: string]: unknown;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  [key: string]: unknown;
}

// ─── Deep Insights ────────────────────────────────────────────────────────────
export interface DeepInsight {
  id: string;
  content: string;
  created_at: string;
  [key: string]: unknown;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  href: string;
  label: string;
  isPro: boolean;
}

// ─── Action Config (UI catalog) ───────────────────────────────────────────────
import type { LucideIcon } from 'lucide-react';

export interface ActionConfig {
  type: QuickActionType;
  label: string;
  sub: string;
  icon: LucideIcon;
  tier: Tier;
  color: string;
  bg: string;
  ring: string;
  insightLabel?: string;
}

export interface StepCopy {
  surface: { q: string; placeholder: string };
  inner: { q: string; placeholder: string };
  meaning: { q: string; placeholder: string };
}