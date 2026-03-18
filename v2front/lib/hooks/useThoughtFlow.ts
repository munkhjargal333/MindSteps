'use client';

import { useState, useCallback } from 'react';
import type { QuickActionType, SessionData, FlowStep } from '../../types/types';
import type { AnalyzeResult } from '@/lib/api/api';
import { analyzeSession, type ApiConfig } from '@/lib/api/api';

// ─── State shape ──────────────────────────────────────────────

type StepData = Omit<SessionData, 'actionType'>;

interface ThoughtFlowState {
  step: FlowStep;
  actionType: QuickActionType | null;
  data: StepData;
  /** Step 4 дээр байх үед ачаалж байгаа эсэх */
  analyzing: boolean;
  /** analyzeSession-с авсан үр дүн */
  result: AnalyzeResult | null;
  error: string | null;
}

const EMPTY_DATA: StepData = {
  surfaceText:   '',
  innerText:      '',
  meaningText: '',
};

// ─── Hook ─────────────────────────────────────────────────────

export function useThoughtFlow(config: ApiConfig) {
  const [state, setState] = useState<ThoughtFlowState>({
    step:       1,
    actionType: null,
    data:       EMPTY_DATA,
    analyzing:  false,
    result:     null,
    error:      null,
  });

  /** Action сонгох (QuickActionHome → ThoughtFlow) */
  const selectAction = useCallback((type: QuickActionType) => {
    setState((s) => ({ ...s, actionType: type, step: 1, data: EMPTY_DATA, result: null, error: null }));
  }, []);

  /** Step data-г patch хийх */
  const updateData = useCallback((patch: Partial<StepData>) => {
    setState((s) => ({ ...s, data: { ...s.data, ...patch } }));
  }, []);

  /** Step 1–3: дараагийн алхамруу */
  const next = useCallback(async () => {
    setState((s) => {
      if (s.step < 3) return { ...s, step: (s.step + 1) as FlowStep };

      // Step 3 → 4: analyze fire-and-forget (state-г analyzing болгоно)
      return { ...s, step: 4, analyzing: true, error: null };
    });
  }, []);

  /** Step 4 triggered: analyze хийх */
  const runAnalysis = useCallback(
    async (session: SessionData) => {
      try {
        console.log('Use');
        const result = await analyzeSession(session, config);
        
        setState((s) => ({ ...s, analyzing: false, result }));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Алдаа гарлаа';
        setState((s) => ({ ...s, analyzing: false, error: msg }));
      }
    },
    [],
  );

  /** Буцах */
  const back = useCallback(() => {
    setState((s) => {
      if (s.step === 1 || s.step === 4) {
        return { ...s, step: 1, actionType: null, data: EMPTY_DATA, result: null, error: null };
      }
      return { ...s, step: (s.step - 1) as FlowStep };
    });
  }, []);

  /** Бүгдийг reset хийх */
  const reset = useCallback(() => {
    setState({
      step:       1,
      actionType: null,
      data:       EMPTY_DATA,
      analyzing:  false,
      result:     null,
      error:      null,
    });
  }, []);

  /** Step 1: үргэлжлүүлж болох эсэх */
  const canProceed = state.step === 1
    ? state.data.surfaceText.trim().length > 2
    : true;

  return {
    // State
    step:       state.step,
    actionType: state.actionType,
    data:       state.data,
    analyzing:  state.analyzing,
    result:     state.result,
    error:      state.error,
    canProceed,
    // Actions
    selectAction,
    updateData,
    next,
    back,
    reset,
    runAnalysis,
  };
}

export type UseThoughtFlowReturn = ReturnType<typeof useThoughtFlow>;
