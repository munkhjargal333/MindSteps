import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// ===== THOUGHT STEP 1: Бодол бичих =====

interface Props {
  thinking: string;
  onThinkingChange: (value: string) => void;
}

export function SignalStep({ thinking, onThinkingChange }: Props) {
  return (
    <Card className="border-none shadow-none bg-transparent sm:border sm:bg-card">
      <CardContent className="pt-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Бодол</h2>
          <p className="text-sm text-muted-foreground">Юу бодогдож байна вэ?</p>
        </div>

        <div>
          <Label htmlFor="thinking" className="text-base">Өөрийн бодлоо бичээрэй</Label>
          <Textarea
            id="thinking"
            value={thinking}
            onChange={(e) => onThinkingChange(e.target.value)}
            placeholder="Бодлоо энд бичээрэй..."
            className="mt-2 min-h-[200px]"
            autoFocus
          />
        </div>
      </CardContent>
    </Card>
  );
}