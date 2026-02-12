import { Card, CardContent } from '@/components/ui/card';
import { 
  Lightbulb, 
  RefreshCw, 
  User, 
  Clock, 
  Eye, 
  ArrowUpRight, 
  Sparkles,
  LucideIcon,
  Cloud
} from 'lucide-react';
import { ThoughtSession } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  session: ThoughtSession;
}

interface InsightItem {
  icon: LucideIcon;
  title: string;
  text: string;
  variant: 'default' | 'info' | 'success'; // 'warning'-ыг хасаж илүү зөөлөн болгов
}

export function ThoughtInsightStep({ session }: Props) {
  const getInsights = (): InsightItem[] => {
    const items: InsightItem[] = [];

    // 1. Давтамж (Familiarity)
    if (session.isFamiliar === true) {
      items.push({
        icon: RefreshCw,
        title: "Танил мэдрэмж",
        text: "Энэ бодол танд өмнө нь ч бас орж ирж байсан байна. Таны доторх нэгэн сонирхолтой түүх бололтой.",
        variant: 'info'
      });
    } else if (session.isFamiliar === false) {
      items.push({
        icon: Sparkles,
        title: "Шинэ содон бодол",
        text: "Сонирхолтой юм! Таны тархи шинэ өнцгөөс харж, шинэ зүйл туршиж эхэлж байна.",
        variant: 'success'
      });
    }

    // 2. Өөртэйгөө холбох (Identity)
    if (session.relatedToSelf === true) {
      items.push({
        icon: User,
        title: "Өөртэйгөө ярилцах",
        text: "Та өөрийнхөө тухай бодож байна. Өөрийгөө сонсож, ойлгох нь маш том алхам шүү.",
        variant: 'default'
      });
    } else if (session.relatedToSelf === false) {
      items.push({
        icon: ArrowUpRight,
        title: "Гадаад ертөнц",
        text: "Та эргэн тойрноо, бусдыг ажиглаж байна. Энэ нь таныг илүү чөлөөтэй, нээлттэй болгодог.",
        variant: 'success'
      });
    }

    // 3. Цаг хугацаа (Time Focus)
    if (session.timeFocus === 'past') {
      items.push({
        icon: Clock,
        title: "Дурсамжийн хуудас",
        text: "Өнгөрсөнд болсон зүйлийг эргэцүүлж байна. Тэндээсээ хэрэгтэйг нь аваад одоо руугаа буцаж ирээрэй.",
        variant: 'info'
      });
    } else if (session.timeFocus === 'future') {
      items.push({
        icon: Clock,
        title: "Төлөвлөгөө ба Хүсэл",
        text: "Ирээдүй рүү өнгийж байна. Энэ нь таны хүсэл мөрөөдөл эсвэл бэлтгэлийн нэг хэсэг юм.",
        variant: 'info'
      });
    } else if (session.timeFocus === 'now' || session.timeFocus === 'neutral') {
      items.push({
        icon: Cloud,
        title: "Яг одоо",
        text: "Та одоо цагтаа, ажиглагчийн байр сууринд байна. Энэ бол сэтгэл амгалан байхын үндэс.",
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
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-primary/5 text-primary/70">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Бодлыг ажиглахуй</h2>
          <p className="text-sm text-muted-foreground">Таны дотоод ертөнцийн жижигхэн зураглал</p>
        </div>

        {/* Thought Highlight Card */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-secondary/30 border-none">
          <p className="text-[11px] text-muted-foreground mb-3 uppercase tracking-widest font-bold opacity-70">
            Бичсэн бодол:
          </p>
          <p className="text-base font-medium leading-relaxed">
            "{session.thinking}"
          </p>
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full blur-2xl" />
        </div>

        {/* Insights Grid */}
        <div className="grid gap-3">
          {insights.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-colors",
                item.variant === 'success' && "bg-emerald-50/40 dark:bg-emerald-950/10",
                item.variant === 'info' && "bg-blue-50/40 dark:bg-blue-950/10",
                item.variant === 'default' && "bg-zinc-50 dark:bg-zinc-900/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-full shrink-0",
                item.variant === 'success' && "text-emerald-500",
                item.variant === 'info' && "text-blue-500",
                item.variant === 'default' && "text-zinc-500"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-normal">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Guidance */}
        <div className="pt-4">
          <p className="text-[12px] text-center text-muted-foreground/60 italic leading-relaxed">
            "Бодол бол үүл шиг ирээд өнгөрнө.<br/>Харин та бол тэр үүлсийг ажиглаж буй тэнгэр юм."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}