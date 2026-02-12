import { useState } from 'react';
import { EmotionSession, Emotion } from '@/types';
import { EmotionSelectStep } from './EmotionSelectStep';
import { AwarenessStep, AwarenessAnswers } from './AwarenessStep';
import { EmotionInsightStep } from './EmotionInsightStep';
import { NavigationControls } from '@/components/shared/NavigationControls';
import { ProgressBar } from '@/components/shared/ProgressBar';

// ===== FLOW: Сэтгэл хөдөл (3 steps - simplified) =====

const TOTAL_STEPS = 3;

interface Props {
  onComplete: (session: EmotionSession) => void;
  onBack: () => void;
}

export function EmotionFlow({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<EmotionSession>>({
    knowTrigger: undefined,
    knowPurpose: undefined,
    fromPast: undefined,
  });

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Complete
      const session: EmotionSession = {
        id: Date.now().toString(),
        createdAt: new Date(),
        emotion: data.emotion!,
        knowTrigger: data.knowTrigger,
        knowPurpose: data.knowPurpose,
        fromPast: data.fromPast,
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
        return data.emotion !== undefined;
      case 2:
        return true; // Awareness асуултууд optional
      case 3:
        return true; // Insight үргэлж харуулна
      default:
        return false;
    }
  };

  const handleAwarenessChange = (answers: AwarenessAnswers) => {
    setData({
      ...data,
      knowTrigger: answers.knowTrigger,
      knowPurpose: answers.knowPurpose,
      fromPast: answers.fromPast,
    });
  };

  return (
    <div className="space-y-6">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      <div className="max-w-3xl mx-auto">
        {step === 1 && (
          <EmotionSelectStep
            selected={data.emotion ?? null}
            onSelect={(v) => setData({ ...data, emotion: v })}
          />
        )}

        {step === 2 && (
          <AwarenessStep
            answers={{
              knowTrigger: data.knowTrigger,
              knowPurpose: data.knowPurpose,
              fromPast: data.fromPast,
            }}
            onChange={handleAwarenessChange}
          />
        )}

        {step === 3 && (
          <EmotionInsightStep session={data as EmotionSession} />
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