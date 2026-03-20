'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  Eye,
  Layers,
  Brain,
  Heart,
  ArrowRight,
  MessageCircle,
  Circle,
  CheckCircle,
  Sunrise,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}

      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-md border-b border-gray-100/50">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sunrise size={22} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Mindful
            </span>
          </motion.div>
          
          <Link 
            href="/login" 
            className="text-xs font-bold text-white bg-indigo-600 px-5 py-2.5 rounded-full active:scale-95 transition-all shadow-md shadow-indigo-100 hover:bg-indigo-700"
          >
            Нэвтрэх
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        
        {/* 1. HERO - Pain + Reframe + CTA */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight">
                  Яагаад би<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                    ийм зовдог юм бол?
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Хэдий чадвартай ч, амжилттай ч гэсэн дотроо тайван бус. 
                  Юу нэг дутуу, юу нэг буруу мэт санагддаг.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <a
                  href="#solution"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  Хариултыг олох
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. INNER MONOLOGUE */}
        <section className="py-16 sm:py-24 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black">
                  Танил дуу санагдах уу?
                </h2>
                <p className="text-slate-400 text-lg">
                  Та ганцаараа биш. Энэ бол бидний дотоод монолог.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <ThoughtCard
                  thought="Бүх зүйл боломжтой гэдгийг мэдэж байгаа ч яагаад эхлэж чадахгүй байна?"
                />
                <ThoughtCard
                  thought="Өдөр бүр ижил зүйлийг давтаад, өөрчлөлт хүлээж байна."
                />
                <ThoughtCard
                  thought="Бусдад туслаж чаддаг ч өөртөө туслаж чадахгүй байна."
                />
                <ThoughtCard
                  thought="Юу хийх ёстойгоо мэдэж байгаа ч яагаад хийхгүй байна?"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. REFRAME - The problem isn't you */}
        <section id="solution" className="py-16 sm:py-24 bg-gradient-to-b from-white to-violet-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-100 rounded-3xl mb-4">
                  <Brain className="w-10 h-10 text-violet-600" />
                </div>
                
                <h2 className="text-3xl sm:text-5xl font-black leading-tight">
                  Асуудал нь<br />
                  <span className="text-violet-600">чи биш</span>
                </h2>
                
                <div className="max-w-2xl mx-auto space-y-6 text-lg text-slate-700 leading-relaxed">
                  <p>
                    Асуудал нь чиний <span className="font-bold text-slate-900">ухамсарын бүтэц</span> юм. 
                    Бид өөрийгөө хэрхэн ажиглаж сурахаа хэзээ ч заагаагүй.
                  </p>
                  <p className="text-violet-600 font-bold">
                    Харж, ойлгож, хүлээн зөвшөөрч сурснаар л өөрчлөлт эхэлдэг.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-violet-100 shadow-xl">
                <div className="space-y-8">
                  <StepCard
                    number="1"
                    title="Өөрийгөө тольдох"
                    description="Бодол, мэдрэмж гэх зэргээ ажиглаж сурах юм. Ажиглаж тэмдэглэж сурсанаар та өөртэйгээ танилцах анхны алхамаа хийж чадна."
                    icon={<Eye className="w-6 h-6" />}
                    color="violet"
                  />
                  <StepCard
                    number="2"
                    title="Далд бүтцийг ойлгох"
                    description="Бидний хэрэгцээ болон эго хэрхэн ажилладгийг ойлгох. Яагаад зарим зүйл биднийг автоматаар идэвхжүүлдгийг олж мэдэх."
                    icon={<Layers className="w-6 h-6" />}
                    color="indigo"
                  />
                  <StepCard
                    number="3"
                    title="Бясалгалын тухай буруу ойлголтоос ангижрах"
                    description="Ихэнх хүмүүс бясалгал яаж хийхээ мэддэггүй. Заасан ч ойлгодоггүй. Бясалгал бол ажиглалт юм."
                    icon={<Circle className="w-6 h-6" />}
                    color="blue"
                  />
                  <StepCard
                    number="4"
                    title="Зовлонгоос ангижрах"
                    description="Бидний дотоод бүтэц зөрчилдөх үед хүн их зовдог. Энэ зөрчилдөөнийг багасгах ухаарал л зовлонгоос ангижруулах зам юм."
                    icon={<Heart className="w-6 h-6" />}
                    color="rose"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. OUTCOMES */}
        <section className="py-16 sm:py-24 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black">
                  Ямар өөрчлөлт гарах вэ?
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Өөрийгөө ойлгосноор амьдрал өөрчлөгддөг
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <OutcomeCard
                  title="Дотоод тайван байдал"
                  description="Гадаад нөхцөл байдлаас хамааралгүй дотроо тогтвортой байх"
                />
                <OutcomeCard
                  title="Илүү ухамсартай"
                  description="Өөрийн хандлага, зуршлаа анзаарч, сонголт хийх чадвар"
                />
                <OutcomeCard
                  title="Жинхэнэ өөрчлөлт"
                  description="Түр биш, бодит, гүнзгий өөрчлөлтийг бий болгох"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. HOW WE HELP - Features as outcomes */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black">
                  Яаж туслах вэ?
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Практик хэрэгслүүд, бодит өөрчлөлтийн төлөө
                </p>
              </div>

              <div className="space-y-6">
                <FeatureOutcome
                  title="Сэтгэл санааны дэвтэр"
                  outcome="→ Өөрийн мэдрэмжийг ажиглаж, хандлагаа тодорхой харах"
                  description="Өдөр тутмын бичлэг нь өөрийгөө тольдох хамгийн хүчтэй арга. Зүгээр л бич, харж эхэл."
                />
                <FeatureOutcome
                  title="Үнэт зүйлсийн пирамид"
                  outcome="→ Амьдралынхаа хэрэгцээг ойлгож, зөрчилдөөнөө олох"
                  description="Маслоугийн шаталлаар өөрийн хэрэгцээг зохион байгуулж, юу дутаж байгааг олох."
                />
                <FeatureOutcome
                  title="Мэдлэгийн сан"
                  outcome="→ Ухамсар, сэтгэл зүйн тухай практик ойлголт олох"
                  description="Философи, сэтгэл зүй, практик дасгалууд - бүгдийг нэг дор."
                />
                <FeatureOutcome
                  title="Явцын бүртгэл"
                  outcome="→ Өөрчлөлтөө харж, урам авах"
                  description="Level, streak, оноо - өсөлтөө харж, үргэлжлүүлэх хүсэл төрүүлэх."
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. PHILOSOPHY CARD - Trust builder */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 sm:p-12 border-2 border-amber-100"
            >
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Бидний итгэл үнэмшил
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Энэ платформ нь зөвхөн хэрэгсэл биш
                  </p>
                </div>

                <div className="space-y-4 text-slate-700">
                  <PhilosophyPoint text="Хүн бүр өөрийгөө ойлгож чадна - зөвхөн хэрэгтэй хэрэгсэл, арга барил л хэрэгтэй" />
                  <PhilosophyPoint text="Өөрчлөлт нь мэдлэгээс биш, практикаас төрдөг" />
                  <PhilosophyPoint text="Та ганцаараа биш - бид хамт аялж байна" />
                  <PhilosophyPoint text="Төгс байх шаардлагагүй, зүгээр л өөрийгөө ойлгох хэрэгтэй" />
                </div>

                <div className="pt-6 border-t border-amber-200">
                  <p className="text-sm text-slate-600 italic text-center">
                    "Өөрийгөө ойлгосноор бид юу хийх ёстойгоо биш, яагаад хийдэггүйгээ ойлгодог. 
                    Энэ ойлголт өөрөө л өөрчлөлт юм."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section id="join" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 rounded-3xl p-8 sm:p-16 text-center space-y-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20" />
              
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Анхны баг руу нэгдэх үү?
                </h2>
                
                <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                  Энэ бол Beta хувилбар. Та зөвхөн хэрэглэгч биш, <span className="text-white font-bold">хамт бүтээгч</span> байх болно. 
                  Таны туршлага, санал бодол платформын ирээдүйг тодорхойлно.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a
                    href="/join"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                  >
                    Одоо эхлэх
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  
                  <a
                    href="https://www.facebook.com/tenger.uhaan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Асуулт асуух
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 text-center space-y-4 bg-white">
          <p className="text-sm text-slate-400">
            © 2026 Mindstep Platform • Beta хувилбар
          </p>
          <p className="text-xs text-slate-400">
            Улаанбаатар, Монгол
          </p>
        </footer>
      </main>
    </div>
  );
}

function ThoughtCard({ thought }: { thought: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
    >
      <p className="text-slate-300 leading-relaxed italic">"{thought}"</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, icon, color }: any) {
  const colorClasses = {
    violet: 'bg-violet-100 text-violet-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    blue: 'bg-blue-100 text-blue-600',
    rose: 'bg-rose-100 text-rose-600',
  };

  return (
    <div className="flex gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 `}>
        {icon}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-bold text-slate-400">0{number}</span>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function OutcomeCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
    >
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function FeatureOutcome({ title, outcome, description }: any) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="p-6 bg-white rounded-2xl border-2 border-slate-100 hover:border-violet-200 transition-all"
    >
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-violet-600 font-semibold">{outcome}</p>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function PhilosophyPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}