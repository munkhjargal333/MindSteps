'use client'

import { Sunrise, ArrowRight, Eye, Zap, Sparkles, Brain, Heart, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MainHeader } from '@/components/shared/MainHeader'
import { ProblemCard } from './_components/ProblemCard'
import { HowItWorksCard } from './_components/HowItWorksCard'
import { FeatureCard } from './_components/FeatureCard'
import { WhoForItem, WhoNotForItem } from './_components/WhoForItems'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />

      <main>
        {/* Hero */}
        <section className="container max-w-3xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="space-y-3">
              <p className="text-lg uppercase tracking-wider text-amber-500 dark:text-amber-400 font-semibold">
                Ухаалаг тэмдэглэлийн дэвтэр
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Таны тэмдэглэл
                <br />
                <span className="text-muted-foreground">таны сэтгэл санааны толь.</span>
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Өдөр бүрийн бодлоо тэмдэглэж, сэтгэл хөдлөл, хэрэгцээгээ ойлго.
                MindSteps танд давтагдах хэв маягийг илрүүлж, ухамсартай амьдрахад туслана.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="/quick">
                  Үнэгүй турших <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a href="/login">Нэвтрэх</a>
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
                  <span className="underline decoration-orange-500 decoration-2 underline-offset-4">
                    90%
                  </span>
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
              <h2 className="text-3xl md:text-4xl font-bold">Хэрхэн ажилладаг вэ?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <HowItWorksCard
                step="01"
                icon={Eye}
                title="Ажиглах"
                description="Өдөр бүр давтагддаг бодол, мэдрэмжээ товч тэмдэглэх. 90 секунд хангалттай"
              />
              <HowItWorksCard
                step="02"
                icon={Zap}
                title="Холбох"
                description="Давтагдаж байгаа зүйлс хоорондоо хэрхэн холбогдож байгааг анзаарах"
              />
              <HowItWorksCard
                step="03"
                icon={Sparkles}
                title="Орон зай"
                description="Бодол, мэдрэмждээ шууд хариу үйлдэл хийхгүй байх орон зай бий болгоно"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t">
          <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12 md:mb-16">
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
                title="Автомат биш, сонголттой болох"
                description="Автомат биш, сонголттой болох."
              />
              <FeatureCard
                icon={BookOpen}
                title="Өөрийгөө буруутгахгүй ойлгох"
                description="Өөрийгөө буруутгахгүй ойлгох."
              />
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="border-t bg-muted/30">
          <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">
                Хэнд зориулсан
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">Энэ систем танд тохирох уу?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">✓ Зориулагдсан</h3>
                <WhoForItem text="Амьдралын утга хайж байгаа хүмүүс" />
                <WhoForItem text="Өөрийгөө таних хүсэлтэй" />
                <WhoForItem text="Зан төлөв, бодлын хэв маягаа үнэхээр ойлгомоор байгаа" />
                <WhoForItem text="16-аас дээш насны хүмүүс" />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-muted-foreground">
                  ✕ Зориулагдаагүй
                </h3>
                <WhoNotForItem text="Сэтгэцийн эмчилгээ хийлгэж байгаа" />
                <WhoNotForItem text="16 хүрээгүй хүүхдүүд" />
                <WhoNotForItem text="Шуурхай, богино хугацаанд бүхнийг шийдэхийг хүсэж байгаа" />
                <WhoNotForItem text="Хүчтэй сэтгэл хөдлөлийн хямрал дунд байгаа" />
              </div>
            </div>

            <div className="mt-8 md:mt-12 p-4 md:p-6 border rounded-lg bg-background">
              <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed">
                <strong className="text-foreground">Чухал анхааруулга:</strong>
                <br />
                MindSteps нь сэтгэцийн эмчилгээний орлуулагч биш. Хэрэв та ноцтой сэтгэл санааны
                хямралтай тулгарч байгаа бол мэргэжлийн эмч, сэтгэл зүйчид хандахыг зөвлөж байна.
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
                  Өөрийгөө илүү тодорхой харж эхэлье
                </h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  Эхний алхмаа үнэгүй хийгээд үз. Хэрэв энэ орон зай танд тохирвол, илүү гүн
                  шатанд нэгдэх боломж нээлттэй.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="/demo">
                    Үнэгүй турших <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <a href="/login">Нэвтрэх</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">MindSteps</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/join" className="hover:text-foreground transition-colors">Join</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 MindSteps</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
