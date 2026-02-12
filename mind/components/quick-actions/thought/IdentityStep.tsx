import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, HelpCircle } from 'lucide-react';

// ===== THOUGHT STEP: Identity Layer =====
// Default: null (Мэдэхгүй)

interface Props {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

export function IdentityStep({ value, onChange }: Props) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Identity</h2>
          <p className="text-muted-foreground">Энэ бодол "би"-тэй холбоотой юу?</p>
          <p className="text-sm text-muted-foreground mt-1">Ego layer илрүүлэх</p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onChange(true)}
            data-selected={value === true}
            className={`h-auto p-4 flex flex-col items-center gap-2 transition-all ${
              value === true
                ? 'bg-purple-500/20 border-purple-500 border-2'
                : 'hover:bg-purple-500/10'
            }`}
          >
            <User className="w-8 h-8 text-purple-600" />
            <div className="text-center">
              <div className="text-sm font-medium">Тийм</div>
              <div className="text-xs text-muted-foreground font-normal">"Би"-тэй</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onChange(null)}
            data-selected={value === null}
            className={`h-auto p-4 flex flex-col items-center gap-2 transition-all ${
              value === null
                ? 'bg-gray-500/20 border-gray-500 border-2'
                : 'hover:bg-gray-500/10'
            }`}
          >
            <HelpCircle className="w-8 h-8 text-gray-600" />
            <div className="text-center">
              <div className="text-sm font-medium">Мэдэхгүй</div>
              <div className="text-xs text-muted-foreground font-normal">-</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onChange(false)}
            data-selected={value === false}
            className={`h-auto p-4 flex flex-col items-center gap-2 transition-all ${
              value === false
                ? 'bg-teal-500/20 border-teal-500 border-2'
                : 'hover:bg-teal-500/10'
            }`}
          >
            <Users className="w-8 h-8 text-teal-600" />
            <div className="text-center">
              <div className="text-sm font-medium">Үгүй</div>
              <div className="text-xs text-muted-foreground font-normal">Neutral</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
