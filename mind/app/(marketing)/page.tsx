'use client';

import { Sunrise, ArrowRight, Eye, Zap, Sparkles, Brain, Heart, BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container max-w-5xl mx-auto h-14 flex items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2.5 group">
            <Sunrise className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
            <span className="text-[17px] font-bold tracking-tight">MindSteps</span>
          </a>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild size="sm">
              <a href="/login">Нэвтрэх</a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container max-w-3xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Ухаалаг тэмдэглэлийн дэвтэр
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Таны тэмдэглэл таныг
                <br />
                <span className="text-muted-foreground">хөгжүүлж чаддаг бол ямар вэ?</span>
              </h1>
            </div>
            

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              MindSteps бол <strong>зөвхөн бичих талбар биш</strong>. Энэ бол таны тэмдэглэлийг 
              <strong>шинжлэх</strong>, давтагдаж буй хэв маягийг илрүүлэх, 
              <strong>автомат амьдралаас гарахад</strong> туслах таны хувийн зөвлөх систем юм.
            </p>

            {/* <p className="text-sm md:text-base text-muted-foreground/80 italic max-w-xl mx-auto">
              Бид таны бодлыг мэдээлэл болгож, мэдрэмжийг чинь эрчим хүч болгон хувиргана.
            </p> */}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 md:pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="/join">
                  Нэгдэх
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="border-t">
          <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Өнөөдрийн бодол өчигдрийн бодлын{' '}
                  <span className="underline decoration-orange-500 decoration-2 underline-offset-4">90%</span>
                  -ийг агуулдаг
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Тоолж барамгүй олон удаа давтагдаад байгаа энэ бодлыг чи мэдэх үү? 
                  Хэрвээ санахгүй байгаа бол та өөрийнхөө талаар тийм ч сайн мэддэггүй гэсэн үг.
                </p>
              </div>

              <div className="space-y-6">
                <ProblemCard
                  icon={Brain}
                  title="Бодол давтагддаг"
                  description="Өдөр бүр ижил сэтгэл санаа, ижил асуудлууд эргэлдэж байдаг уу?"
                />
                <ProblemCard
                  icon={Heart}
                  title="Мэдрэмж автомат болсон"
                  description="Яагаад уурлаж, гуниглаж байгаагаа ч ойлгохгүй байдаг уу?"
                />
                <ProblemCard
                  icon={Sparkles}
                  title="Өөрчлөлт хүсэж байгаа"
                  description="Амьдралдаа утга учир олохыг хүсч байгаа боловч хаанаас эхлэхээ мэдэхгүй байна уу?"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t bg-muted/30">
          <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">Арга зам</p>
              <h2 className="text-3xl md:text-4xl font-bold">Хэрхэн ажилладаг вэ?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <HowItWorksCard
                step="01"
                icon={Eye}
                title="Ажиглах"
                description="Өдөр бүр давтагддаг бодол, мэдрэмжээ ажиглаж тэмдэглэх. 10 секунд байхад хангалттай."
              />
              <HowItWorksCard
                step="02"
                icon={Zap}
                title="Холбох"
                description="Давтагдаж буй бодол, мэдрэмжүүд хоорондоо хэрхэн холбоотойг харах."
              />
              <HowItWorksCard
                step="03"
                icon={Sparkles}
                title="Орон зай"
                description="Ажигласан зүйл дээрээ шууд хариу үйлдэл хийхгүй байх боломж."
              />
            </div>

          </div>
        </section>

        {/* Features */}
        <section className="border-t">
          <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">Боломжууд</p>
              <h2 className="text-3xl md:text-4xl font-bold">Юу хийж болох вэ?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <FeatureCard
                icon={Brain}
                title="Тодорхой байдал"
                description="Толгойд эргэлддэг бодлуудаа цэгцтэй харах."
              />
              <FeatureCard
                icon={Eye}
                title="Ухамсар"
                description="Автомат хариу үйлдэл хэзээ идэвхждгийг анзаарах."
              />
              <FeatureCard
                icon={BookOpen}
                title="Ойлголт"
                description="Өөрийн дотоод төлөвийн тухай шинэ өнцөг олж харах."
              />
            </div>

          </div>
        </section>

        {/* Who It's For */}
        <section className="border-t bg-muted/30">
          <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">Хэнд зориулсан</p>
              <h2 className="text-3xl md:text-4xl font-bold">Энэ систем танд тохирох уу?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">✓ Зориулагдсан</h3>
                <WhoForItem text="Амьдралын утга хайж байгаа хүмүүс" />
                <WhoForItem text="Өөрийгөө таних хүсэлтэй" />
                <WhoForItem text="Давтагдаж байгаа бодлоосоо чөлөөлөгдөх" />
                <WhoForItem text="16-аас дээш насны хүмүүс" />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-muted-foreground">✕ Зориулагдаагүй</h3>
                <WhoNotForItem text="Сэтгэцийн эмчилгээ хийлгэж байгаа" />
                <WhoNotForItem text="16 хүрээгүй хүүхдүүд" />
                <WhoNotForItem text="Шуурхай шийдэл хайж байгаа" />
                <WhoNotForItem text="Хэт мэдрэг, төсөөлөлдөө төөрдөг" />
              </div>
            </div>

            <div className="mt-8 md:mt-12 p-4 md:p-6 border rounded-lg bg-background">
              <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed">
                <strong className="text-foreground">Чухал анхааруулга:</strong> MindSteps нь сэтгэцийн эмчилгээний орлуулагч биш. 
                Хэрэв та ноцтой сэтгэл санааны асуудалтай тулгарч байгаа бол мэргэжлийн эмч, 
                сэтгэл зүйчтэй уулзахыг зөвлөж байна.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t">
          <div className="container max-w-2xl mx-auto px-4 py-20 md:py-32 text-center">
            <div className="space-y-6 md:space-y-8">
              <div>
                <Sunrise className="w-10 h-10 md:w-12 md:h-12 text-orange-500 mx-auto mb-4 md:mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                  Өөрийгөө таних аялалд гарцгаая
                </h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  Үнэгүй бүртгүүлэх, кредит карт шаардлагагүй.
                </p>
              </div>

              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="/join">
                  Үнэгүй эхлэх
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">MindSteps</span>
            </div>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              {/* <a href="/about" className="hover:text-foreground transition-colors">About</a> */}
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/join" className="hover:text-foreground transition-colors">Join</a>
            </div>

            <p className="text-sm text-muted-foreground">© 2026 MindSteps</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Problem Card
function ProblemCard({ icon: Icon, title, description }: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm md:text-base">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Component: How It Works Card
function HowItWorksCard({ step, icon: Icon, title, description }: {
  step: string;
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div className="text-4xl font-light text-muted-foreground/40">{step}</div>
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold uppercase tracking-wide">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// Component: Feature Card
function FeatureCard({ icon: Icon, title, description }: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// Component: Who For Item
function WhoForItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

// Component: Who Not For Item
function WhoNotForItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground/40">✕</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}