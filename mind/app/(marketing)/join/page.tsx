'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  Crown, 
  CheckCircle2, 
  Star, 
  Mail, 
  MessageCircle, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-2">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            MindSteps <span className="text-primary">Founders Club</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Ирээдүйн платформыг хамт бүтээлцэх алсын хараатай түншүүдийг хайж байна
          </p>
        </div>

        {/* Main Benefits Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Анхдагч-уудийн давуу тал
              </p>
            </div>
            <CardTitle>Зөвхөн хэрэглэгч биш, хамт бүтээгч байх</CardTitle>
            <CardDescription>
              Платформын хөгжил, стратегийн чиглэлийг хамт тодорхойлох боломж
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Зөвхөн хэрэглэгч биш, хамт бүтээгч байх орон зай',
                'Платформын хөгжил, стратегийн чиглэлийг хамт тодорхойлох',
                'Хөнгөлөлт, урамшуулал, зөвхөн гишүүдэд зориулсан саналууд',
                'Ирээдүйд оролцооны хэлбэрээр хувь хүртэх боломж',
                'Дотоод хүрээний уулзалт, эвентүүдэд урилгаар оролцох'
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
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
              description="Хөрөнгө оруулагч, стратегийн түнш"
              bgClass="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
            />
            
            <TierCard
              icon={<Sparkles className="w-5 h-5 text-emerald-500" />}
              title="FIRST100"
              description="Үнэгүй • 98 суудал үлдсэн"
              bgClass="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
              isSpecial
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button asChild variant="outline" size="lg" className="w-full">
            <a href="mailto:munkhjargal.ts39@gmail.com" className="gap-2">
              <Mail className="w-4 h-4" />
              Email илгээх
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
              Facebook холбогдох
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
  );
}

function TierCard({ 
  icon, 
  title, 
  description, 
  bgClass, 
  isSpecial = false 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgClass: string;
  isSpecial?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:shadow-sm ${bgClass}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold mb-0.5">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </div>
  );
}