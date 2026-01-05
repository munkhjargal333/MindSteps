'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  Sunrise,
  Fingerprint,
  Map,
  Layers,
  Brain,
  Search,
  Heart,
  Home,
  User,
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
            title="Та цор ганц өгөгдөл"
            text={`Таны мэдрэмж, хариу үйлдэл бол таны амьдралын түүхээс бүтсэн 'хурууны хээ' юм. Бусадтай адилхан байх албагүй. 

            Өөрийгөө олох нь шинэ хүн болох тухай биш, харин дээр чинь хуримтлагдсан бусдын хүлээлтийг арилгаж, 'жинхэнэ өөрийгөө' ил гаргах үйл явц юм.`}
          />

          <SoftCard
            icon={<Map className="text-indigo-500" />}
            title="Дотоод луужингаа тохируулах"
            text={`Сэтгэл хөдлөл бол таныг хаашаа явахыг зааж өгдөг луужин юм. 

            Уурлаж байвал таны хил хязгаарыг давсныг, атаархаж байвал та юуг хүсэж байгаагаа, гуниглаж байвал юу танд үнэ цэнтэй байсныг хэлж өгдөг.`}
            foot="Мэдрэмжээ сонсож сурах нь өөрийгөө хайрлахын эхлэл."
          />

          <SoftCard
            icon={<Heart className="text-amber-500" />}
            title="Хэрэгцээгээ хүлээн зөвшөөрөх"
            text={`Өөрийгөө олох хамгийн дөт зам бол 'Надад яг одоо юу хэрэгтэй байна вэ?' гэж асуух юм. 

            Амралт уу? Хэн нэгэнд сонсогдох уу? Эсвэл зүгээр л ганцаараа байх уу? Өөрийнхөө хэрэгцээг үл тоомсорлох нь өөрөөсөө холдохын нэр юм.`}
          />
        </div>

          {/* SCIENCE SECTION */}
        <section className="bg-indigo-50/50 rounded-[2.5rem] p-8 border border-indigo-100 space-y-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Brain className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Шинжлэх ухаан ба Зөн совин
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Бид <b>Plutchik</b>-ийн өнгөт дугуй болон <b>Hawkins</b>-ийн ухамсарын түвшинг ашиглан таны дотоод ертөнцийг зураглахад тусална. Энэ бол зүгээр нэг тест биш, таны өөрийгөө тодорхойлох толь юм.
          </p>
        </section>


          {/* FOOTER CALL TO ACTION */}
          <motion.section variants={fadeInUp} className="space-y-8">
            <div className="text-center space-y-3">
              <h3 className="font-bold text-2xl tracking-tight">Өөрийн түүхээ хадгалах</h3>
              <p className="text-gray-500 text-sm px-6">Бид таны дотоод өөрчлөлтүүдийг нандигнан хадгална.</p>
            </div>

            <div className="space-y-4">
              <Link href="/login" className="group flex items-center justify-center gap-3 w-full py-5 bg-indigo-600 rounded-[2rem] text-white font-bold transition-all hover:bg-indigo-700 active:scale-[0.97] shadow-xl shadow-indigo-100">
                Аяллаа эхлэх
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 text-center">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Бүртгүүлэх</span>
                <p className="text-[13px] text-gray-400 font-medium italic">Тун удахгүй: Шинэ гишүүд 2-р сард</p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>

      {/* MOBILE BOTTOM TAB BAR - Improved padding and Blur */}
      <div className="fixed bottom-0 w-full z-[100] px-4 pb-6">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl shadow-black/5 h-20 flex items-center justify-around px-4">
          <TabItem icon={<Home size={24} />} active label="Нүүр" />
          <TabItem icon={<Compass size={24} />} label="Хайх" />
          <TabItem icon={<Layers size={24} />} label="Түүх" />
          <TabItem icon={<User size={24} />} label="Профайл" />
        </div>
      </div>
    </div>
  );
}

// Components with improved styles
function TabItem({ icon, active = false, label }: { icon: React.ReactNode, active?: boolean, label: string }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center gap-1 p-2 transition-all ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
    >
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
      {active && <motion.div layoutId="tab-dot" className="w-1 h-1 bg-indigo-600 rounded-full" />}
    </motion.div>
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