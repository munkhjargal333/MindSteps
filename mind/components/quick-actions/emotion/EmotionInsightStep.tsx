import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Heart, 
  Compass, 
  History, 
  Eye, 
  Sun, 
  Wind,
  Info,
  LucideIcon
} from 'lucide-react';
import { EmotionSession } from '@/types';
import { EMOTIONS } from '@/data/emotions';
import { cn } from '@/lib/utils';

interface Props {
  session: EmotionSession;
}

interface InsightItem {
  icon: LucideIcon;
  title: string;
  text: string;
  variant: 'default' | 'info' | 'success'; // Warning-г хасаж илүү эерэг болгов
}

export function EmotionInsightStep({ session }: Props) {
  const emotionData = EMOTIONS.find((e) => e.id === session.emotion);

  const getInsights = (): InsightItem[] => {
    const items: InsightItem[] = [];

    // 1. Сэтгэл хөдлөлийн ерөнхий төлөв
    if (emotionData?.band === 'lower') {
      items.push({
        icon: Heart,
        title: "Хамгаалалтын төлөв",
        text: "Таны дотоод хүн яг одоо өөрийгөө хамгаалахаар хичээж байна. Энэ бол зүй ёсны хэрэг. Зүгээр л өөртөө амсхийх хугацаа өгөөрэй.",
        variant: 'info'
      });
    } else {
      items.push({
        icon: Sun,
        title: "Нээлттэй төлөв",
        text: "Та маш тогтуун байна. Энэ үед та өөрийгөө болон эргэн тойрноо илүү тодоор харж, суралцах боломжтой байдаг.",
        variant: 'success'
      });
    }

    // 2. Шалтгааны тухай
    if (session.knowTrigger) {
      items.push({
        icon: Compass,
        title: "Шалтгаан тодорхой",
        text: "Сэтгэл хөдлөлийнхөө эх үүсвэрийг мэднэ гэдэг нь залуур таны гарт байна гэсэн үг. Энэ бол маш том давуу тал.",
        variant: 'success'
      });
    } else {
      items.push({
        icon: Eye,
        title: "Ажиглалтын мөч",
        text: "Заримдаа мэдрэмжүүд шалтгаангүй юм шиг ирдэг. Энэ үед зүгээр л ажиглаад өнгөрөөх нь хамгийн сайн арга юм шүү.",
        variant: 'default'
      });
    }

    // 3. Зорилго
    if (session.knowPurpose) {
      items.push({
        icon: Sparkles,
        title: "Зорилгоо ойлгосон",
        text: "Мэдрэмжээ юу хэлэх гээд байгааг таньсан байна. Ингэснээр та дотоод зөрчилгүйгээр урагшлах боломжтой боллоо.",
        variant: 'success'
      });
    } else {
      items.push({
        icon: Wind,
        title: "Мэдрэмжийн зурвас",
        text: "Энэ мэдрэмж танд ямар нэгэн хэрэгцээг тань сануулж байж магадгүй. Өөрөөсөө 'Танд юу хэрэгтэй байна?' гэж асуугаад үзээрэй.",
        variant: 'info'
      });
    }

    // 4. Цаг хугацааны нөлөө
    if (session.fromPast) {
      items.push({
        icon: History,
        title: "Хуучин түүх",
        text: "Өнгөрсөн үеийн дурсамж одоогийн мөчид нөлөөлж байна. Үүнийг анзаарсан нь өөрөө өнгөрснөөс чөлөөлөгдөх эхлэл юм.",
        variant: 'default'
      });
    } else {
      items.push({
        icon: Info,
        title: "Шинэ мэдрэмж",
        text: "Энэ бол яг одоогийн бодит мэдрэмж. Та өөртэйгөө маш илэн далангүй, үнэнээрээ нүүр тулж байна.",
        variant: 'success'
      });
    }

    return items;
  };

  const insights = getInsights();

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="pt-6 space-y-8">
        {/* Header section */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-primary/5 text-primary/70">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Дотоод ажиглалтын үр дүн</h2>
        </div>

        {/* Emotion Highlight Card */}
        <div className="relative overflow-hidden p-8 rounded-[2rem] bg-secondary/30 border-none">
          <div className="text-center relative z-10">
            <span className="text-6xl mb-4 block animate-bounce-slow">{emotionData?.emoji}</span>
            <h3 className="text-2xl font-bold">{emotionData?.label}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[220px] mx-auto leading-relaxed italic">
              "{emotionData?.description}"
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Insights Grid */}
        <div className="grid gap-3">
          {insights.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-start gap-4 p-5 rounded-2xl transition-all border-none",
                item.variant === 'success' && "bg-emerald-50/50 dark:bg-emerald-900/10",
                item.variant === 'info' && "bg-blue-50/50 dark:bg-blue-900/10",
                item.variant === 'default' && "bg-zinc-50 dark:bg-zinc-900/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-full shrink-0",
                item.variant === 'success' && "text-emerald-500",
                item.variant === 'info' && "text-blue-500",
                item.variant === 'default' && "text-zinc-400"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Guidance */}
        <div className="pt-6">
          <p className="text-[12px] text-center text-muted-foreground/60 italic leading-relaxed px-4">
            "Мэдрэмж бүхэн өөрийн гэсэн зорилготой. Түүнийг зөөлөн ажигласнаар та өөрийгөө илүү ихээр хайрлаж сурна."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}