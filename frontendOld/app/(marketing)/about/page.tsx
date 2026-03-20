'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Compass,
  Heart,
  Users,
  Target,
  Lightbulb,
  ArrowRight,
  Code2,
  Brain,
  Layers,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-black text-base sm:text-lg tracking-tight">
                Mind<span className="text-indigo-600">step</span>
              </span>
            </Link>
            
            <Link 
              href="/login"
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              Нэвтрэх
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-20">
        
        {/* HERO */}
        <section className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Бидний <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">тухай</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
              Mindstep бол зүгээр нэг программ биш - 
              <span className="font-bold text-slate-900"> өөрийгөө олох аяллын хамтрагч</span>.
            </p>
          </motion.div>
        </section>

        {/* VISION - Story */}
        <section className="py-8 sm:py-12 space-y-6 sm:space-y-8">
          <StoryCard
            icon={<Compass className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500" />}
            title="Яагаад энэ платформыг бүтээж байна вэ?"
            content={`Бид бодно - хүн бүр амьдралынхаа явцад нэг л удаа болзошгүй "Би хэн бэ?" гэдэг асуултыг өөртөө тавьдаг. 

Гэхдээ энэ асуултын хариулт олдоггүй. Учир нь өнөөдрийн ертөнц маш их мэдээлэл, маш олон сонголт, маш хурдан өөрчлөлтөөр дүүрэн. 

Бид өөрөө амьдралынхаа тоглогч болохын оронд, бусдын хүлээлт, нийгмийн хэвшмэлтэй тоглоомд тоглогч болж орхидог.

Mindstep танд зогсох, амьсгаа авах, дотогш харах орон зай өгнө. Та хэн бэ? Та юунд итгэдэг вэ? Таны сэтгэл хөдлөл танд юу хэлж байна вэ?`}
          />

          <StoryCard
            icon={<Heart className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500" />}
            title="Юунд итгэдэг вэ?"
            content={`**Өөрийгөө ойлгох нь хамгийн чухал дадал.**

Бид хэнд ч заах гэж оролддоггүй. Харин таны сэтгэл, бодол, амьдралын үнэ цэнэ танд өөртөө тодорхой болоход нь туслах хэрэгсэл өгөхийг зорьдог.

Та зүгээр нэг өдрийг тэмдэглэнэ. Дараа нь долоо хоног. Дараа нь сар. Аажмаар таны мэдрэмжийн зураглал гарч ирнэ. Та таныг хөдөлгөдөг зүйлүүдийг ойлгож эхэлнэ.

**Энэ процесс-ын гол түлхүүр бол: Тууштай байдал ба Чин сэтгэл.**`}
          />

          <StoryCard
            icon={<Target className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" />}
            title="Зорилго бол юу вэ?"
            content={`Богино хугацаанд: 
Хэрэглэгчид өөрсдийн мэдрэмж, бодол, үнэт зүйлсээ ойлгож, бүртгэж, өөрчлөлтөө ажиглах боломж олгох.

Урт хугацаанд:
Монгол улсад сэтгэл зүй, ухамсарын өсөлт, өөрийгөө танихад чиглэсэн анхны платформ болж, мянга мянган хүнд өдөр тутмын дэмжлэг үзүүлэх.

**Энэ зүгээр бизнес биш. Энэ бол mission.**`}
          />
        </section>

        {/* HOW IT WORKS - Process */}
        <section className="py-8 sm:py-12 space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black">Хэрхэн ажилладаг вэ?</h2>
            <p className="text-sm sm:text-base text-slate-500">Процессын алхмууд</p>
          </div>

          <div className="space-y-4">
            <ProcessStep
              number="01"
              icon={<Brain className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />}
              title="Мэдрэмж бүртгэх"
              description="Өдөр тутам өөрийн сэтгэл санааг бичих. Энэ нь танд өөртөө анхаарал хандуулах дадал болно."
            />
            
            <ProcessStep
              number="02"
              icon={<Layers className="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />}
              title="Үнэт зүйлсээ тодорхойлох"
              description="Маслоугийн пирамид ашиглан амьдралынхаа юунд хамгийн их ач холбогдол өгдгөө олж харах."
            />
            
            <ProcessStep
              number="03"
              icon={<Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />}
              title="Мэдлэг олох"
              description="Сэтгэл зүйн практик мэдлэгүүд, тайлбарууд, дасгалуудаар өөрийгөө хөгжүүлэх."
            />
            
            <ProcessStep
              number="04"
              icon={<Compass className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />}
              title="Өөрчлөлтөө хянах"
              description="Хугацааны явцад таны мэдрэмж, сэтгэл санаа хэрхэн өөрчлөгдөж байгааг graph, статистикаар үзэх."
            />
          </div>
        </section>

        {/* CURRENT STATUS - Beta Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-8 sm:py-12"
        >
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 border-2 border-indigo-100">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                <Code2 className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Одоогийн байдал: Beta</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Бид одоогоор хөгжүүлэлтийн эхний үе шатанд байна. 
                    Платформ бүрэн дүүрэн биш, алдаа гарч болно, гэхдээ 
                    <span className="font-bold text-slate-900"> бид өдөр бүр сайжирч байна</span>.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                  <StatBox
                    icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />}
                    label="Анхдагч"
                    value="20 суудал"
                  />
                  <StatBox
                    icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
                    label="Төлөв"
                    value="Beta Testing"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-8 sm:py-12"
        >
          <div className="bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Хамтдаа аялцгаая</h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Та зүгээр нэг хэрэглэгч биш. Та анхны баг. Хамтдаа энэ платформыг бүтээцгээе.
              </p>
            </div>

            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95 text-sm sm:text-base"
            >
              Багт нэгдэх
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="pt-12 sm:pt-16 pb-8 text-center space-y-4">
          <p className="text-xs sm:text-sm text-slate-400">
            © {new Date().getFullYear()} Mindstep Platform • Beta Version
          </p>
        </footer>
      </main>
    </div>
  );
}

function StoryCard({ icon, title, content }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-4 sm:space-y-5 shadow-sm"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight pt-2">{title}</h3>
      </div>
      
      <div className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
        {content.split('\n\n').map((paragraph: string, i: number) => (
          <p key={i} className={paragraph.startsWith('**') ? 'font-bold text-slate-900' : ''}>
            {paragraph.replace(/\*\*/g, '')}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

function ProcessStep({ number, icon, title, description }: any) {
  return (
    <div className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
      <div className="shrink-0 space-y-3">
        <div className="text-3xl sm:text-4xl font-black text-slate-100">{number}</div>
        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="flex-1 pt-1 space-y-2">
        <h4 className="text-base sm:text-lg font-bold text-slate-900">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-500 font-semibold">{label}</div>
        <div className="text-sm sm:text-base font-black text-slate-900">{value}</div>
      </div>
    </div>
  );
}