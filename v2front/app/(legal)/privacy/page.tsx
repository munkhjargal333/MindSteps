'use client';

import Link from 'next/link';
import { ArrowLeft, Database, Lock, Share2, EyeOff, Sunrise } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "1. Мэдээлэл цуглуулах",
      content: "Бид таныг бүртгүүлэх үед и-мэйл хаяг болон нэрийг тань авдаг. Мөн таны апп дотор бичсэн тэмдэглэл, бодол болон хувийн хөгжлийн явцыг зөвхөн танд зориулан манай өгөгдлийн санд нууцлалтайгаар хадгална."
    },
    {
      icon: Lock,
      title: "2. Мэдээллийн аюулгүй байдал",
      content: "Таны бүх өгөгдөл орчин үеийн шифрлэлтийн (encryption) технологиор хамгаалагдана. Бид таны нууц үгийг хэзээ ч шууд текстээр хадгалдаггүй бөгөөд зөвхөн таныг нэвтрэх эрхтэй байх бүх боломжийг хангадаг."
    },
    {
      icon: Share2,
      title: "3. Гуравдагч талд дамжуулах",
      content: "MindSteps нь хэрэглэгчийн хувийн мэдээлэл болон тэмдэглэлийг хэзээ ч зарж борлуулахгүй, маркетинг болон сурталчилгааны зорилгоор бусдад дамжуулахгүй. Таны өгөгдөл зөвхөн таны апп-ын туршлагыг сайжруулахад ашиглагдана."
    },
    {
      icon: EyeOff,
      title: "4. Таны эрх",
      content: "Та хүссэн үедээ өөрийн мэдээллийг шинэчлэх, устгах эрхтэй. Хэрэв та бүртгэлээ устгахаар шийдвэл таны бүх тэмдэглэл болон хувийн мэдээлэл манай серверээс бүрмөсөн устах болно."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Буцах
            </Link>
          </Button>
          
          <Link href="/" className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-sm">MindSteps</span>
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-16 md:py-24">
        {/* Page Header */}
        <div className="mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Privacy Policy / 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Нууцлалын бодлого
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Таны хувийн орон зай манайд аюулгүй. Бид таны итгэлийг хамгаалахын тулд 
            мэдээллийн нууцлалыг дээд зэргээр хангадаг.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">
                  {section.title}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-13">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MindSteps. Бүх эрх хуулиар хамгаалагдсан.
            <span className="hidden sm:inline"> • </span>
            <br className="sm:hidden" />
            Улаанбаатар, Монгол
          </p>
        </div>
      </main>
    </div>
  );
}