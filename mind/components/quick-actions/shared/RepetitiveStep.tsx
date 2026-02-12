import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, HelpCircle } from 'lucide-react';

// ===== SHARED STEP: Repetitive Check =====
// Default: null (Мэдэхгүй)

interface Props {
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  question?: string;
}

export function RepetitiveStep({ 
  value, 
  onChange,
  question = "Энэ танил уу?"
}: Props) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">{question}</h2>
          <p className="text-sm text-muted-foreground">
            Ego / survival pattern илрүүлэх
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onChange(true)}
            data-selected={value === true}
            className={`h-auto p-4 flex flex-col items-center gap-2 transition-all ${
              value === true
                ? 'bg-green-500/20 border-green-500 border-2'
                : 'hover:bg-green-500/10'
            }`}
          >
            <Check className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium">Тийм, танил</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onChange(undefined)}
            data-selected={value === undefined}
            className={`h-auto p-4 flex flex-col items-center gap-2 transition-all ${
              value === undefined
                ? 'bg-gray-500/20 border-gray-500 border-2'
                : 'hover:bg-gray-500/10'
            }`}
          >
            <HelpCircle className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium">Мэдэхгүй</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onChange(false)}
            data-selected={value === false}
            className={`h-auto p-4 flex flex-col items-center gap-2 transition-all ${
              value === false
                ? 'bg-blue-500/20 border-blue-500 border-2'
                : 'hover:bg-blue-500/10'
            }`}
          >
            <X className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium">Үгүй, шинэ</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
