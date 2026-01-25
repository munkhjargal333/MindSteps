'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sunrise,
  Fingerprint,
  Map,
  Search,
  Heart,
  ArrowRight,
} from 'lucide-react';

// Animations variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-[#1A1C1E] selection:bg-indigo-100 selection:text-indigo-900">
      {/* NAV - Glassmorphism */}
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

      <main className="max-w-md mx-auto px-6 pt-28 pb-32">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-14"
        >
          {/* HERO SECTION */}
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-indigo-600"
          >
            <Search size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">
              өөрийгөө таних аялал
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[2.6rem] font-black leading-[1.05] tracking-tight"
          >
            Гадаад ертөнцөөс <br />
            түр завсарлаж, <br />
            <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-8">дотоод руугаа</span> <br />
            өнгийх үү?
          </motion.h1>

          <p className="text-gray-500 leading-relaxed font-medium text-lg">
            Бид бусдыг ойлгох гэж хичээдэг хэрнээ, хамгийн чухал хүн болох "өөрийгөө" танихаа мартаж орхидог.
          </p>
        </section>

          {/* CORE CONCEPTS */}
        <div className="space-y-12">
          <SoftCard
            icon={<Fingerprint className="text-rose-500" />}
            title={"Та бол цор ганц 'Эх хувь'"}
            text={`Таны мэдрэмж, хариу үйлдэл бол таны амьдралын түүхээс бүтсэн 'хурууны хээ' юм. Бусадтай адилхан байх гэж өөрийгөө хүчлэх шаардлагагүй. 

            Өөрийгөө олох нь шинэ хүн болох тухай биш, харин дээр чинь хуримтлагдсан бусдын хүлээлтийг арилгаж, гүнд нь нуугдсан 'жинхэнэ өөрийгөө' чөлөөлөх үйл явц юм.`}
          />

          <SoftCard
              icon={<Heart className="text-indigo-500" />}
              title="Өөрийгөө 'тайлж' унших нь"
              text={`Мэдрэмж хэзээ ч санамсаргүй биш. Таны байнга давтагддаг бодол, сэтгэлийн гэнэтийн хөдөлгөөнүүд бол таны дотоод ертөнцийн 'зураглал' юм. Тэр бүхнийг ажиглаж сурах тусам та өөрийнхөө учрыг олж эхэлнэ.`}
              foot="Мэдрэмжээ сонсох нь өөртэйгөө хийх хамгийн анхны чин сэтгэлийн яриа."
            />

          <SoftCard
              icon={<Map className="text-amber-500" />}
              title="Та өөрчлөгдөх боломжтой"
              text={`Өөрчлөлт гэдэг нэг л өглөө тохиодог үсрэлт биш, харин чимээгүй явагддаг процесс. Гэхдээ та нэгэнт л өөрийгөө анзаарч эхэлсэн бол өөрчлөлт аль хэдийн эхэлсэн гэсэн үг. Ухамсарласан зүйл хэзээ ч хэвээрээ үлддэггүй, тэр танаас зугтаж чадахгүй.`}
              foot="Нэгэнт л гэрэл туссан газарт харанхуй удаан тогтдоггүй."
            />
        </div>

          {/* SCIENCE SECTION */}
        {/* <section className="bg-indigo-50/50 rounded-[2.5rem] p-8 border border-indigo-100 space-y-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Brain className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Шинжлэх ухаан ба Зөн совин
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Бид <b>Plutchik</b>-ийн өнгөт дугуй болон <b>Hawkins</b>-ийн ухамсарын түвшинг ашиглан таны дотоод ертөнцийг зураглахад тусална. Энэ бол зүгээр нэг тест биш, таны өөрийгөө тодорхойлох толь юм.
          </p>
        </section> */}

          {/* MARKETING COLLABORATION SECTION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-1 bg-gradient-to-br from-indigo-500 via-violet-400 to-amber-200 rounded-[2.5rem]"
          >
            <div className="bg-white rounded-[2.4rem] p-8 text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-gray-900">
                  Хамтдаа бүтээлцэх үү? 🤝
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Бидний зорилгыг дэмжиж, хамтран ажиллах эсвэл <br />
                  <span className="text-indigo-600 font-bold">АНХДАГЧ</span> болох боломж танд нээлттэй.
                </p>
              </div>

              <Link 
                href="/unauthorized" 
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Дэлгэрэнгүй мэдээлэл авах
                <ArrowRight size={18} />
              </Link>

              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-[0.2em]">
                #Community #Mindfulness #Partnership
              </p>
            </div>
          </motion.div>

          {/* FOOTER CALL TO ACTION */}
          <motion.section variants={fadeInUp} className="space-y-8">
            <div className="text-center space-y-3">

              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Mindful Platform. Бүх эрх хуулиар хамгаалагдсан.
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> • </span>
                Улаанбаатар, Монгол
              </p>
            </div>

          </motion.section>
        </motion.div>
      </main>

    </div>
  );
}

function SoftCard({
  icon,
  title,
  text,
  foot,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  foot?: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-gray-50 rounded-2xl inline-block">{icon}</div>
        <h3 className="font-black text-lg leading-tight tracking-tight">{title}</h3>
      </div>
      <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-line font-medium">
        {text}
      </p>
      {foot && (
        <div className="pt-2 flex items-center gap-2">
           <div className="h-px flex-1 bg-indigo-50"></div>
           <div className="text-[11px] font-bold text-indigo-500 italic uppercase tracking-wider">{foot}</div>
        </div>
      )}
    </motion.div>
  );
}