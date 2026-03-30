// ─────────────────────────────────────────────────────────────────────────────
// features/journal/hooks/useJournalFlow.ts
// Feature-specific hook — ALL state + logic for the thought flow wizard.
// UI components receive only primitives and callbacks from this hook.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback, useRef } from 'react';
import type { QuickActionType, SessionData, FlowStep, AnalyzeResult } from '@/types';
import { analyzeSession } from '@/lib/services/analysis.service';
import { useThoughtContext } from '@/contexts/TierContext';

// ─── Internal state shape ─────────────────────────────────────────────────────

type StepData = Omit<SessionData, 'actionType'>;

interface JournalFlowState {
  step: FlowStep;
  actionType: QuickActionType | null;
  data: StepData;
  analyzing: boolean;
  result: AnalyzeResult | null;
  error: string | null;
}

const EMPTY_DATA: StepData = {
  surfaceText: '',
  innerText: '',
  meaningText: '',
};

const INITIAL_STATE: JournalFlowState = {
  step: 1,
  actionType: null,
  data: EMPTY_DATA,
  analyzing: false,
  result: null,
  error: null,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useJournalFlow
 *
 * Manages the entire 4-step journal flow:
 *   Step 1 – Surface (what happened)
 *   Step 2 – Inner Reaction (how you felt)
 *   Step 3 – Meaning (what it means)
 *   Step 4 – Seed Insight (AI-generated reflection)
 *
 * Architectural decisions:
 * - All API calls go through the service layer (analyzeSession)
 * - Context is read via ref to avoid stale closures inside callbacks
 * - No JSX — this hook is purely logic
 */
export function useJournalFlow(onBack?: () => void) {
  const ctx = useThoughtContext();
  const [state, setState] = useState<JournalFlowState>(INITIAL_STATE);

  // Use a ref so callbacks always read the latest context without re-subscribing
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  // ── Action selection (step 0 → step 1) ────────────────────────────────────
  const selectAction = useCallback((type: QuickActionType) => {
    setState((s) => ({
      ...s,
      actionType: type,
      step: 1,
      data: EMPTY_DATA,
      result: null,
      error: null,
    }));
  }, []);

  // ── Field updates ─────────────────────────────────────────────────────────
  const updateData = useCallback((patch: Partial<StepData>) => {
    setState((s) => ({ ...s, data: { ...s.data, ...patch } }));
  }, []);

  // ── Navigation: forward ───────────────────────────────────────────────────
  const next = useCallback(() => {
    setState((s) => {
      if (s.step < 3) return { ...s, step: (s.step + 1) as FlowStep };
      // Step 3 → 4: trigger analysis
      return { ...s, step: 4, analyzing: true, error: null };
    });
  }, []);

  // ── Navigation: backward ──────────────────────────────────────────────────
  const back = useCallback(() => {
    setState((s) => {
      if (s.step === 1 || s.step === 4) {
        onBack?.(); // Caller decides navigation (router.push etc.)
        return s;
      }
      return { ...s, step: (s.step - 1) as FlowStep };
    });
  }, [onBack]);

  // ── Reset: stay on same action, return to step 1 ──────────────────────────
  const reset = useCallback(() => {
    setState((s) => ({
      step: 1,
      actionType: s.actionType,
      data: EMPTY_DATA,
      analyzing: false,
      result: null,
      error: null,
    }));
  }, []);

  // ── Analysis: called by SeedInsightStep on mount ──────────────────────────
  const runAnalysis = useCallback(async (session: SessionData) => {
    try {
      const result = await analyzeSession(session, { token: ctxRef.current.token });
      setState((s) => ({ ...s, analyzing: false, result }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Алдаа гарлаа';
      setState((s) => ({ ...s, analyzing: false, error: msg }));
    }
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────
  const canProceed =
    state.step === 1 ? state.data.surfaceText.trim().length > 2 : true;

  const session: SessionData | null =
    state.actionType
      ? { actionType: state.actionType, ...state.data }
      : null;

  return {
    // State
    step: state.step,
    actionType: state.actionType,
    data: state.data,
    analyzing: state.analyzing,
    result: state.result,
    error: state.error,
    canProceed,
    session,
    // Actions
    selectAction,
    updateData,
    next,
    back,
    reset,
    runAnalysis,
  } as const;
}

export type UseJournalFlowReturn = ReturnType<typeof useJournalFlow>;
