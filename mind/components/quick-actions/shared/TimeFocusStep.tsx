import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Sparkles, Minus } from 'lucide-react';
import { TimeFocus } from '@/types';

// ===== SHARED STEP: Time Focus =====

interface Props {
  value: TimeFocus | null;
  onChange: (value: TimeFocus) => void;
}

const OPTIONS = [
  { value: 'past' as TimeFocus, label: 'Past', icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-500/10 hover:bg-gray-500/20' },
  { value: 'now' as TimeFocus, label: 'Now', icon: Sparkles, color: 'text-green-600', bg: 'bg-green-500/10 hover:bg-green-500/20' },
  { value: 'future' as TimeFocus, label: 'Future', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500/10 hover:bg-blue-500/20' },
  { value: 'neutral' as TimeFocus, label: 'Neutral', icon: Minus, color: 'text-purple-600', bg: 'bg-purple-500/10 hover:bg-purple-500/20' },
];

export function TimeFocusStep({ value, onChange }: Props) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Цагийн төвлөрөл</h2>
          <p className="text-muted-foreground">Энэ бодол/мэдрэмж хэзээтэй холбоотой вэ?</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = value === option.value;

            return (
              <Button
                key={option.value}
                variant="outline"
                onClick={() => onChange(option.value)}
                data-selected={isSelected}
                className={`h-auto p-4 flex flex-col items-center gap-3 transition-all ${option.bg} ${
                  isSelected ? 'border-2 ring-2 ring-offset-2 ring-primary/20' : ''
                }`}
              >
                <Icon className={`w-8 h-8 ${option.color}`} />
                <span className="text-sm font-medium">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
