import { Card, CardContent } from '@/components/ui/card';
import { 
  Check, 
  X, 
  HelpCircle, 
  RefreshCw, 
  User, 
  Clock, 
  Sparkles, 
  ArrowRightCircle, 
  Infinity, 
  LucideIcon 
} from 'lucide-react';
import { OptionButton } from '@/components/shared/option-button';

export interface ThoughtAwarenessAnswers {
  isFamiliar?: boolean;
  relatedToSelf?: boolean;
  timeFocus?: 'past' | 'now' | 'future' | 'neutral' | null;
}

interface QuestionConfig {
  id: keyof ThoughtAwarenessAnswers;
  label: string;
  icon: LucideIcon;
  description?: string;
  type: 'binary' | 'time';
}

interface Props {
  answers: ThoughtAwarenessAnswers;
  onChange: (answers: ThoughtAwarenessAnswers) => void;
}

const QUESTIONS: QuestionConfig[] = [
  { 
    id: 'isFamiliar', 
    label: 'Энэ бодол танил уу?', 
    icon: RefreshCw,
    description: 'Өмнө нь ийм бодол төрж байсан уу?',
    type: 'binary'
  },
  { 
    id: 'relatedToSelf', 
    label: 'Таны тухай бодол уу?', 
    icon: User,
    description: 'Бодлын гол дүр нь та өөрөө юу?',
    type: 'binary'
  },
  { 
    id: 'timeFocus', 
    label: 'Хэзээ болсон үйл явдал бэ?', 
    icon: Clock,
    description: 'Бодол тань хаашаа чиглэж байна?',
    type: 'time'
  }
];

export function ThoughtAwarenessStep({ answers, onChange }: Props) {
  const updateAnswer = (key: keyof ThoughtAwarenessAnswers, value: any) => {
    onChange({ ...answers, [key]: value });
  };

  return (
    <Card className="border-none shadow-none bg-transparent sm:border sm:bg-card sm:shadow-sm sm:rounded-3xl">
      <CardContent className="pt-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Бодлоо ажиглах мөч</h2>
          <p className="text-sm text-muted-foreground">Зүгээр л ажиглаад, сонголтоо хийгээрэй ✨</p>
        </div>

        <div className="space-y-12">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-5">
              <div className="flex items-center gap-4 px-1">
                  {/* Icon: Зөөлөн фонтой, жижиг бөөрөнхий */}
                  <div className="p-3 rounded-2xl bg-primary/5 text-primary/60 shrink-0 transition-transform group-hover:scale-105">
                    <q.icon size={20} />
                  </div>

                  {/* Labels: Зүүн талдаа */}
                  <div className="space-y-0.5">
                    <h4 className="text-[15px] font-bold tracking-tight leading-none text-foreground">
                      {q.label}
                    </h4>
                    {q.description && (
                      <p className="text-[12px] text-muted-foreground/80 leading-snug">
                        {q.description}
                      </p>
                    )}
                  </div>
                </div>

              {q.type === 'binary' && (
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
              )}

              {q.type === 'time' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                  <OptionButton
                    visual={Clock}
                    label="Өнгөрсөн"
                    isSelected={answers.timeFocus === 'past'}
                    onClick={() => updateAnswer('timeFocus', answers.timeFocus === 'past' ? null : 'past')}
                  />
                  <OptionButton
                    visual={Sparkles}
                    label="Одоо"
                    isSelected={answers.timeFocus === 'now'}
                    onClick={() => updateAnswer('timeFocus', answers.timeFocus === 'now' ? null : 'now')}
                  />
                  <OptionButton
                    visual={ArrowRightCircle}
                    label="Ирээдүй"
                    isSelected={answers.timeFocus === 'future'}
                    onClick={() => updateAnswer('timeFocus', answers.timeFocus === 'future' ? null : 'future')}
                  />
                  <OptionButton
                    visual={Infinity}
                    label="Хамаагүй"
                    isSelected={answers.timeFocus === 'neutral'}
                    onClick={() => updateAnswer('timeFocus', answers.timeFocus === 'neutral' ? null : 'neutral')}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-dashed">
          <p className="text-[12px] text-center text-muted-foreground italic">
            "Хариулт бүр таныг өөртэйгөө ойртоход тусална"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}