import { Progress } from '@/components/ui/progress';

type Props = {
  current: number;
  total: number;
};

// ===== ЗАСАХ: Progress bar өнгө болон хэмжээ =====
export function ProgressBar({ current, total }: Props) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full space-y-2">
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Step {current} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
