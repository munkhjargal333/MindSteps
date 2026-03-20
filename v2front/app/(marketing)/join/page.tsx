'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Crown,
  CheckCircle2,
  Star,
  Mail,
  MessageCircle,
  Sparkles,
  Heart,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TierCard } from './_components/TierCard'

const FOUNDER_BENEFITS = [
  'Санаа, санал шүүмжээ шууд дамжуулж, платформд нөлөөлөх',
  'Хөгжлийн үе шат бүрт тэргүүн зэргийн хандалт, туршилт',
  'Ирээдүйд хэрэглэгч биш, түнш байх боломж (хувь хүртэх)',
  'Зөвхөн анхны гишүүдэд зориулсан хөнгөлөлт, урамшуулал',
  'Дотоод хүрээний уулзалт, эвентүүдэд урилга',
]

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
      <div className="max-w-2xl w-full space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            MindSteps <span className="text-primary">Founders Club</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            MindSteps одоогоор анхны шатандаа явж байна. Энэ платформын эхний гишүүд
            ирээдүйн чиглэлийг тодорхойлоход онцгой үүрэг гүйцэтгэнэ.
          </p>
        </div>

        {/* Personal Note */}
        <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground border-l-4 border-primary">
          <p className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>
              <strong>Анхны гишүүд эрэлхийлж байна.</strong>
            </span>
          </p>
        </div>

        {/* Main Benefits Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Анхдагч-уудын давуу тал
              </p>
            </div>
            <CardTitle>Зөвхөн хэрэглэгч биш, хамт бүтээгч байх</CardTitle>
            <CardDescription>
              Платформын хөгжил, стратегийн чиглэлийг хамт тодорхойлох боломж
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {FOUNDER_BENEFITS.map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Selection */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Боломжит түвшнүүд
          </p>
          <div className="space-y-2">
            <TierCard
              icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
              title="ANGEL"
              description="Хөрөнгө оруулагч / Стратегийн түнш"
              badge="Хязгаарлагдмал"
              bgClass="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
              onClick={() => { window.location.href = 'mailto:munkhjargal.ts39@gmail.com?subject=ANGEL Investor' }}
            />
            <TierCard
              icon={<Sparkles className="w-5 h-5 text-emerald-500" />}
              title="FIRST100"
              description="Үнэгүй гишүүнчлэл • 98 суудал үлдсэн"
              badge="Хязгаарлагдмал"
              bgClass="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
              isSpecial
              onClick={() => { window.location.href = 'mailto:munkhjargal.ts39@gmail.com?subject=FIRST100' }}
            />
            <TierCard
              icon={<Heart className="w-5 h-5 text-rose-500" />}
              title="FUNDEA"
              description="Санхүүжилт / Хандив / Дэмжлэг – жижиг ч гэсэн тусламж"
              bgClass="bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900"
              onClick={() => window.open('https://fundea.mn/yourproject', '_blank')}
            />
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
              <span className="text-xs font-bold text-primary">Т</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Та</span> анхны гишүүдийн нэг болох боломжтой.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button asChild variant="outline" size="lg" className="w-full">
            <a href="mailto:munkhjargal.ts39@gmail.com" className="gap-2">
              <Mail className="w-4 h-4" />
              Над руу имэйл илгээх
            </a>
          </Button>
          <Button asChild size="lg" className="w-full">
            <a
              href="https://www.facebook.com/tenger.uhaan"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Facebook-ээр холбогдох
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full mt-4">
            <Link href="/login" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Нэвтрэх хэсэг рүү буцах
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MindSteps. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </div>
  )
}
