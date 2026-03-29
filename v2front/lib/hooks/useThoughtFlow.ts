'use client';

import { useState, useCallback, useRef } from 'react';
import type { QuickActionType, SessionData, FlowStep } from '../../types/types';
import type { AnalyzeResult } from '@/lib/api/api';
import { analyzeSession } from '@/lib/api/api';
import { useThoughtContext, type ThoughtContextValue } from '@/contexts/context';

// ─── State ────────────────────────────────────────────────────

type StepData = Omit<SessionData, 'actionType'>;

interface ThoughtFlowState {
  step:       FlowStep;
  actionType: QuickActionType | null;
  data:       StepData;
  analyzing:  boolean;
  result:     AnalyzeResult | null;
  error:      string | null;
}

const EMPTY_DATA: StepData = {
  surfaceText: '',
  innerText:   '',
  meaningText: '',
};

// ─── Hook ─────────────────────────────────────────────────────

export function useThoughtFlow(onBack?: () => void) { 
  const ctx = useThoughtContext();

  const [state, setState] = useState<ThoughtFlowState>({
    step:       1,
    actionType: null,
    data:       EMPTY_DATA,
    analyzing:  false,
    result:     null,
    error:      null,
  });

  // Render бүрт шинэ ctx авна
  const configRef = useRef<ThoughtContextValue>(ctx);
  configRef.current = ctx;

  const selectAction = useCallback((type: QuickActionType) => {
    setState((s) => ({
      ...s,
      actionType: type,
      step:       1,
      data:       EMPTY_DATA,
      result:     null,
      error:      null,
    }));
  }, []);

  const updateData = useCallback((patch: Partial<StepData>) => {
    setState((s) => ({ ...s, data: { ...s.data, ...patch } }));
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      if (s.step < 3) return { ...s, step: (s.step + 1) as FlowStep };
      return { ...s, step: 4, analyzing: true, error: null };
    });
  }, []);

  const runAnalysis = useCallback(async (session: SessionData) => {
    try {
      const result = await analyzeSession(session, configRef.current);
      setState((s) => ({ ...s, analyzing: false, result }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Алдаа гарлаа';
      setState((s) => ({ ...s, analyzing: false, error: msg }));
    }
  }, []);

  const back = useCallback(() => {
    setState((s) => {
      if (s.step === 1 || s.step === 4) {
        onBack?.(); // Нүүр хуудас руу буцна
        return s;   // State өөрчлөхгүй
      }
      return { ...s, step: (s.step - 1) as FlowStep };
    });
  }, [onBack]);

  const reset = useCallback(() => {
    setState((s) => ({
      step:       1,
      actionType: s.actionType, 
      data:       EMPTY_DATA,
      analyzing:  false,
      result:     null,
      error:      null,
    }));
  }, []);

  const canProceed =
    state.step === 1
      ? state.data.surfaceText.trim().length > 2
      : true;

  return {
    step:       state.step,
    actionType: state.actionType,
    data:       state.data,
    analyzing:  state.analyzing,
    result:     state.result,
    error:      state.error,
    canProceed,
    selectAction,
    updateData,
    next,
    back,
    reset,
    runAnalysis,
  };
}

export type UseThoughtFlowReturn = ReturnType<typeof useThoughtFlow>;