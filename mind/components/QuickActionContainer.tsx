'use client';

import { useState } from 'react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { QuickActionHome } from '@/components/quick-actions/QuickActionHome';
import { ThoughtFlow } from '@/components/quick-actions/thought/ThoughtFlow';
import { EmotionFlow } from '@/components/quick-actions/emotion/EmotionFlow';
import { QuickActionType, ThoughtSession, EmotionSession } from '@/types';

// ===== MAIN CONTAINER: Quick Actions =====

export function QuickActionContainer() {
  const [currentAction, setCurrentAction] = useState<QuickActionType | null>(null);

  const handleSelectAction = (action: QuickActionType) => {
    setCurrentAction(action);
  };

  const handleThoughtComplete = (session: ThoughtSession) => {
    console.log('Thought session completed:', session);
    // TODO: Save to localStorage or Supabase
    alert('✅ Тэмдэглэл хадгалагдлаа!');
    setCurrentAction(null);
  };

  const handleEmotionComplete = (session: EmotionSession) => {
    console.log('Emotion session completed:', session);
    // TODO: Save to localStorage or Supabase
    alert('✅ Сэтгэл хөдлөл хадгалагдлаа!');
    setCurrentAction(null);
  };

  const handleBack = () => {
    setCurrentAction(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!currentAction && (
          <QuickActionHome onSelectAction={handleSelectAction} />
        )}

        {currentAction === 'thought' && (
          <ThoughtFlow onComplete={handleThoughtComplete} onBack={handleBack} />
        )}

        {currentAction === 'emotion' && (
          <EmotionFlow onComplete={handleEmotionComplete} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
