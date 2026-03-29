'use client'

import Link from 'next/link'
import { Sunrise, ArrowRight, Eye, Zap, Sparkles, Brain, Heart, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MainHeader } from '@/components/shared/MainHeader'
import { ProblemCard } from './_components/ProblemCard'
import { HowItWorksCard } from './_components/HowItWorksCard'
import { FeatureCard } from './_components/FeatureCard'
import { WhoItem } from './_components/WhoItem'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />

      <main>
        {/* ───────────────────────────────────────────
            HERO
            A/B варианты:
              Variant A (одоогийн): "Таны тэмдэглэл / таны сэтгэл санааны толь."
              Variant B (шинэ):     "Өдөр бүр 90 секунд. / Өөрийгөө ойлгож эхэл."
            Доорх нь Variant B — илүү конкрет, үйлдэл уриалсан
        ─────────────────────────────────────────── */}
        <section className="container max-w-3xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="space-y-3">
              <p className="text-lg uppercase tracking-wider text-amber-500 dark:text-amber-400 font-semibold">
                Ухаалаг тэмдэглэлийн дэвтэр
              </p>

              {/* VARIANT B HEADLINE — shorter, action-oriented */}
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Өдөр бүр 90 секунд.
                <br />
                <span className="text-muted-foreground">Өөрийгөө ойлгож эхэл.</span>
              </h1>

              {/* VARIANT B SUBTITLE — юу хийх / яагаад / ямар үр дүн гурвыг нэг мөрөнд */}
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Давтагддаг бодол, мэдрэмж, дотоод хэрэгцээгээ бич.
                MindSteps хэв маягийг илрүүлж, яагаад гэдгийг тайлбарлана.
              </p>
            </div>

            {/* CTA хос — primary нь demo, secondary нь нэвтрэх */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/demo" prefetch>
                  Туршиж үзэх <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/login">Нэвтрэх</Link>
              </Button>
            </div>

            {/* Friction бууруулах micro-copy */}
            <p className="text-xs text-muted-foreground">
              Бүртгэл шаардахгүй · Үнэгүй · 90 секунд
            </p>
          </div>
        </section>

        {/* ───────────────────────────────────────────
            PROBLEM STATEMENT
            Одоогийнх аль хэдийн маш сайн (9.5/10).
            Гарчгийг бага зэрэг хурцалсан; cards-ийг хэвээр орхив.
        ─────────────────────────────────────────── */}
        <section className="border-t">
          <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
              <div className="space-y-3 md:space-y-4">
                {/* HOOK — тоог тод байлгав, асуултыг илүү шууд болгов */}
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Өнөөдрийн бодлын{' '}
                  <span className="underline decoration-orange-500 decoration-2 underline-offset-4">
                    90%
                  </span>{' '}
                  өчигдрийн давталт.
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Ижил бодол. Ижил мэдрэмж. Ижил хариу үйлдэл.
                  Хэрвээ энэ давталт байгааг мэдэхгүй байгаа бол —
                  өөрийнхөө талаар тийм ч ихийг мэдэхгүй байна.
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

        {/* ───────────────────────────────────────────
            HOW IT WORKS
            Одоогийнх generic (8/10).
            Алхам бүрийг товч, үйл үгтэй болгов.
            Хугацааны indicator нэмсэн нь "90 секунд" messaging-тэй уялдана.
        ─────────────────────────────────────────── */}
        <section className="border-t bg-muted/30">
          <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12 md:mb-16 space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">Хэрхэн ажилладаг вэ?</h2>
              {/* Sub-headline нэмж context өгөв */}
              <p className="text-muted-foreground text-base">
                Өдөр бүр 4 алхам. Нийт 90 секунд.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <HowItWorksCard
                step={1}
                icon={Eye}
                title="Бич"
                description="Өдрийн давтагдаж байсан бодол, мэдрэмжийг товч тэмдэглэ. 90 секунд хангалттай."
              />
              <HowItWorksCard
                step={2}
                icon={Zap}
                title="Давталтыг ол"
                description="MindSteps тэмдэглэлүүдийн хооронд ямар хэв маяг байгааг автоматаар харуулна."
              />
              <HowItWorksCard
                step={3}
                icon={Sparkles}
                title="Шалтгааныг хар"
                description="Яагаад тэр мэдрэмж үүсдэг, ямар хэрэгцээ цаана байгааг ойлгож эхэл."
              />
              <HowItWorksCard
                step={4}
                icon={Brain}
                title="Өөрчлөгдөж эхэл"
                description="Хэв маягаа мэдсэн тэр мөчөөс автомат биш, ухамсартай хариу үйлдэл гаргаж эхэлнэ."
              />
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────
            FEATURES
            Гарчгийг "Ямар үр дүнтэй вэ?" → "Та юу ойлгож эхлэх вэ?"
            Card copy-г outcomes-oriented болгов (feature → benefit).
        ─────────────────────────────────────────── */}
        <section className="border-t">
          <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12 md:mb-16 space-y-2">
              {/* VARIANT B SECTION TITLE */}
              <h2 className="text-3xl md:text-4xl font-bold">Та юу ойлгож эхлэх вэ?</h2>
              <p className="text-muted-foreground text-base">
                Зөвхөн тэмдэглэл биш — өөрийнхөө зургийг бүтнээр нь хар.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <FeatureCard
                icon={Brain}
                title="Ямар бодол давтагдаж байгааг"
                description="Тэмдэглэлүүдийг нэгтгэж, гурав ч, арав ч давтагдсан хэв маягийг нүдэнд үзүүлнэ."
              />
              <FeatureCard
                icon={Heart}
                title="Яагаад уурлаж, гуниглаж байгааг"
                description="Сэтгэл хөдлөлийн триггер — тодорхой нөхцөл, хүн, цаг — харагдаж эхэлнэ."
              />
              <FeatureCard
                icon={Sparkles}
                title="Цаана нь ямар хэрэгцээ байгааг"
                description="Уур, айдас, гунигийн цаана ямар биелэгдээгүй хэрэгцээ байдгийг тодруулна."
              />
              <FeatureCard
                icon={BookOpen}
                title="Бодол яагаад тойрч байгааг"
                description="Шийдэгдээгүй асуудлууд бичигдэх тусам тодорхой болж, тойрох нь зогсдог."
              />
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────
            WHO IT'S FOR — 10/10, хэвээр үлдээв
        ─────────────────────────────────────────── */}
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
                <WhoItem variant="for" text="Амьдралын утга хайж байгаа хүмүүс" />
                <WhoItem variant="for" text="Өөрийгөө таних хүсэлтэй" />
                <WhoItem variant="for" text="Зан төлөв, бодлын хэв маягаа үнэхээр ойлгомоор байгаа" />
                <WhoItem variant="for" text="16-аас дээш насны хүмүүс" />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-muted-foreground">
                  ✕ Зориулагдаагүй
                </h3>
                <WhoItem variant="not" text="Сэтгэцийн эмчилгээ хийлгэж байгаа" />
                <WhoItem variant="not" text="16 хүрээгүй хүүхдүүд" />
                <WhoItem variant="not" text="Шуурхай, богино хугацаанд бүхнийг шийдэхийг хүсэж байгаа" />
                <WhoItem variant="not" text="Хүчтэй сэтгэл хөдлөлийн хямрал дунд байгаа" />
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

        {/* ───────────────────────────────────────────
            CTA
            Одоогийнх poetic (9/10).
            Variant B: тоог дахин давтаж urgency + specificity нэмэв.
            "Үнэгүй эхлэх" нь "Үнэгүй турших"-аас илүү commitment feel-тэй.
        ─────────────────────────────────────────── */}
        <section className="border-t">
          <div className="container max-w-3xl mx-auto px-4 py-20 md:py-32">
            <div className="text-center space-y-6 md:space-y-8">
              <div className="space-y-3">
                <p className="text-lg uppercase tracking-wider text-amber-500 dark:text-amber-400 font-semibold">
                  Эхлэх цаг нь болсон
                </p>

                {/* VARIANT B CTA HEADLINE — тоог ашиглаж specificity өгөв */}
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                  Өөрийгөө ойлгоход
                  <br />
                  <span className="text-muted-foreground">90 секунд хангалттай.</span>
                </h2>

                {/* VARIANT B CTA SUBTITLE — outcome + action */}
                <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                  Өдөр бүр нэг тэмдэглэл.
                  Долоо хоногт давтагдах хэв маяг.
                  Сараар — өөрийгөө шинээр харах.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/demo" prefetch>
                    Туршиж үзэх <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/login">Нэвтрэх</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — хэвээр */}
      <footer className="border-t bg-background">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-orange-500" aria-hidden="true" />
              <span className="font-semibold">MindSteps</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/upgrade" className="hover:text-foreground transition-colors">Upgrade</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/join" className="hover:text-foreground transition-colors">Join</Link>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MindSteps</p>
          </div>
        </div>
      </footer>
    </div>
  )
}