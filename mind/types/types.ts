export type QuickActionType =
  | 'stress' | 'loneliness' | 'gratitude' | 'self_doubt'   // free
  | 'purpose' | 'values' | 'fear' | 'joy';                  // pro

export type Tier = 'free' | 'pro';

export interface SessionData {
  actionType: QuickActionType;
  surfaceText: string;
  innerText: string;
  meaningText: string;
}

export interface SeedInsight {
  mirror: string;
  reframe: string;
  relief: string;
}

export type FlowStep = 1 | 2 | 3 | 4;

export interface JournalEntry {
  id: number;
  status: 'pending' | 'analyzing' | 'done' | 'failed';
  text: string;
}
