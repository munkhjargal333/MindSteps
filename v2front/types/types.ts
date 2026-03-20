// ─── Tier ────────────────────────────────────────────────────────────────────

export type Tier = 'free' | 'pro';

// ─── Action types ─────────────────────────────────────────────────────────────

export type QuickActionType =
  | 'stress'
  | 'loneliness'
  | 'gratitude'
  | 'self_doubt'
  | 'purpose'
  | 'values'
  | 'fear'
  | 'joy';

// ─── Flow ─────────────────────────────────────────────────────────────────────

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
}
