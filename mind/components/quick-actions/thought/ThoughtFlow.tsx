import { useState } from 'react';
import { ThoughtSession } from '@/types';
import { SignalStep } from './SignalStep';
import { ThoughtAwarenessStep, ThoughtAwarenessAnswers } from './ThoughtAwarenessStep';
import { ThoughtInsightStep } from './ThoughtInsightStep';
import { NavigationControls } from '@/components/shared/NavigationControls';
import { ProgressBar } from '@/components/shared/ProgressBar';

// ===== FLOW: Тэмдэглэл (3 steps - simplified) =====

const TOTAL_STEPS = 3;

interface Props {
  onComplete: (session: ThoughtSession) => void;
  onBack: () => void;
}

export function ThoughtFlow({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<ThoughtSession>>({
    isFamiliar: undefined,
    relatedToSelf: undefined,
    timeFocus: undefined,
  });

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Complete
      const session: ThoughtSession = {
        id: Date.now().toString(),
        createdAt: new Date(),
        feeling: '',
        thinking: data.thinking || '',
        isFamiliar: data.isFamiliar ?? false,
        timeFocus: data.timeFocus || 'now',
        relatedToSelf: data.relatedToSelf ?? false,
      };
      onComplete(session);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.thinking && data.thinking.trim().length > 0;
      case 2:
        return true; // Awareness асуултууд optional
      case 3:
        return true; // Insight үргэлж харуулна
      default:
        return false;
    }
  };

  const handleAwarenessChange = (answers: ThoughtAwarenessAnswers) => {
    setData({
      ...data,
      isFamiliar: answers.isFamiliar,
      relatedToSelf: answers.relatedToSelf,
      timeFocus: answers.timeFocus || undefined,
    });
  };

  return (
    <div className="space-y-6">

      <ProgressBar current={step} total={TOTAL_STEPS} />

      <div className="max-w-3xl mx-auto">
        {step === 1 && (
          <SignalStep
            thinking={data.thinking || ''}
            onThinkingChange={(v) => setData({ ...data, thinking: v })}
          />
        )}

        {step === 2 && (
          <ThoughtAwarenessStep
            answers={{
              isFamiliar: data.isFamiliar,
              relatedToSelf: data.relatedToSelf,
              timeFocus: data.timeFocus,
            }}
            onChange={handleAwarenessChange}
          />
        )}

        {step === 3 && (
          <ThoughtInsightStep session={data as ThoughtSession} />
        )}
      </div>

      <NavigationControls
        onNext={handleNext}
        onBack={handlePrevious}
        onReset={onBack}
        showNext={true}
        showBack={true}
        nextDisabled={!canProceed()}
        nextLabel={step === TOTAL_STEPS ? 'Complete' : 'Continue'}
      />
    </div>
  );
}