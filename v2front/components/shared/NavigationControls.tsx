import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
  onReset: () => void;
  showNext?: boolean;
  showBack?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
};

// ===== ЗАСАХ: Button стиль, label текст =====
export function NavigationControls({
  onNext,
  onBack,
  onReset,
  showNext = true,
  showBack = true,
  nextDisabled = false,
  nextLabel = 'Үргэлжлүүлэх',
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      {showBack ? (
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Буцах
        </Button>
      ) : (
        <div />
      )}

      <Button variant="ghost" onClick={onReset} size="sm">
        <RotateCcw className="w-4 h-4 mr-2" />
        Дахин эхлүүлэх
      </Button>

      {showNext && onNext && (
        <Button onClick={onNext} disabled={nextDisabled} size="lg">
          {nextLabel}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
