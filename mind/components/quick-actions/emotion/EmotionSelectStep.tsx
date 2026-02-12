import { Card, CardContent } from '@/components/ui/card';
import { Emotion } from '@/types';
import { EMOTIONS } from '@/data/emotions';
import { OptionButton } from '@/components/shared/option-button';
import { Heart } from 'lucide-react';

interface Props {
  selected: Emotion | null;
  onSelect: (emotion: Emotion) => void;
}

export function EmotionSelectStep({ selected, onSelect }: Props) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="pt-6 space-y-8">
        {/* Header - Илүү зөөлөн */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-rose-50 text-rose-400 dark:bg-rose-950/20">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Мэдрэмжээ тодорхойлох</h2>
          <p className="text-sm text-muted-foreground">
            Яг одоо зүрх сэтгэл чинь юу өгүүлж байна вэ? ✨
          </p>
        </div>

        {/* Emotion Grid - Mobile дээр 2, Desktop дээр 3 эсвэл 4 багана */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {EMOTIONS.map((emotion) => (
            <OptionButton
              key={emotion.id}
              visual={emotion.emoji}
              label={emotion.label}
              subLabel={emotion.english}
              isSelected={selected === emotion.id}
              onClick={() => onSelect(emotion.id)}
              // Indicator-ыг ✨ эсвэл цэг шиг жижиг болгож зөөлрүүлэв
              indicator={emotion.band === 'upper' ? 'upper' : undefined} 
            />
          ))}
        </div>

        {/* Footer Guidance - Бага зэрэг зөөлрүүлсэн тайлбар */}
        <div className="pt-6 border-t border-dashed border-primary/10">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground/60 font-medium italic">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-300 opacity-50" />
              <span>Дотоод ажиглалт</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 opacity-50" />
              <span>Сэтгэл санаа тэлэх</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}