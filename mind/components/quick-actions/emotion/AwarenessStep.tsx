import { Card, CardContent } from '@/components/ui/card';
import { Check, X, HelpCircle, Target, ShieldCheck, History, LucideIcon, Search, Heart, Compass } from 'lucide-react';
import { OptionButton } from '@/components/shared/option-button';

export interface AwarenessAnswers {
  knowTrigger?: boolean;
  knowPurpose?: boolean;
  fromPast?: boolean;
}

interface QuestionConfig {
  id: keyof AwarenessAnswers;
  label: string;
  icon: LucideIcon;
  description?: string;
}

interface Props {
  answers: AwarenessAnswers;
  onChange: (answers: AwarenessAnswers) => void;
}

const QUESTIONS: QuestionConfig[] = [
  { 
    id: 'knowTrigger', 
    label: 'Юунаас болсныг мэдэх үү?', 
    icon: Search, // Target-аас илүү хайгуул хийж буй мэдрэмж
    description: 'Энэ мэдрэмжийг юу эхлүүлсэн бэ?'
  },
  { 
    id: 'knowPurpose', 
    label: 'Танд юу хэлэх гээд байна?', 
    icon: Heart, // ShieldCheck-ээс илүү хайрласан, ойлгосон мэдрэмж
    description: 'Магадгүй энэ таныг ямар нэг зүйлээс хамгаалж байгаа юм болов уу?'
  },
  { 
    id: 'fromPast', 
    label: 'Хуучин түүхтэй холбоотой юу?', 
    icon: History,
    description: 'Өмнө нь болж байсан зүйлийг сануулж байна уу?'
  }
];

export function AwarenessStep({ answers, onChange }: Props) {
  const updateAnswer = (key: keyof AwarenessAnswers, value: boolean | undefined) => {
    onChange({ ...answers, [key]: value });
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="pt-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary/5 text-primary/60">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Дотоод ажиглалт</h2>
          <p className="text-sm text-muted-foreground italic">Мэдрэмжээ зөөлөн шинжье</p>
        </div>

        {/* Questions */}
        <div className="space-y-12">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-5">
              <div className="flex items-center gap-4 px-1">
                  {/* Icon - Илүү зөөлөн пастел фонтой */}
                  <div className="p-3 rounded-2xl bg-secondary/50 text-primary/70 shrink-0">
                    <q.icon size={22} />
                  </div>
                  
                  <div className="space-y-0.5 text-left">
                    <p className="text-[16px] font-bold leading-tight tracking-tight">
                      {q.label}
                    </p>
                    {q.description && (
                      <p className="text-[13px] text-muted-foreground leading-snug">
                        {q.description}
                      </p>
                    )}
                  </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                <OptionButton
                  visual={Check}
                  label="Тийм"
                  isSelected={answers[q.id] === true}
                  onClick={() => updateAnswer(q.id, answers[q.id] === true ? undefined : true)}
                />
                <OptionButton
                  visual={X}
                  label="Үгүй"
                  isSelected={answers[q.id] === false}
                  onClick={() => updateAnswer(q.id, answers[q.id] === false ? undefined : false)}
                />
                <OptionButton
                  visual={HelpCircle}
                  label="Мэдэхгүй"
                  isSelected={answers[q.id] === undefined}
                  onClick={() => updateAnswer(q.id, undefined)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-dashed">
          <p className="text-[12px] text-center text-muted-foreground/70 leading-relaxed">
             Мэдрэмжээ хүлээн зөвшөөрөх нь тайвшралын эхлэл юм ✨
          </p>
        </div>
      </CardContent>
    </Card>
  );
}