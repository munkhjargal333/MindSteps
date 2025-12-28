'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, Layers, Info, CheckCircle2, 
  Sparkles, Brain, Heart, Compass, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function MVPLanding() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-50 selection:text-blue-600">
      
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Layers size={18} />
            </div>
            <span className="font-black tracking-tight text-lg">Mindful</span>
          </div>
          <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900">
            Нэвтрэх
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider mb-8"
        >
          <Sparkles size={14} /> Мэдрэмжийг ойлгох
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1]"
        >
          Холимог мэдрэмжүүдээ <br />
          <span className="text-blue-600">нэрлэж, цэгцэл</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
        >
          Яг одоо юу мэдэрч байгаагаа ойлгоход тань тусална. 
          <br className="hidden sm:block" />
          Ойлгомжгүй төлөвийг тодорхой болгох 2 минутын арга.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Link href="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 group">
            Одоогийн төлөвөө ойлгох <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-gray-400 mt-4 font-medium">2 минут • Бүртгэлгүй туршиж үзэх</p>
        </motion.div>
      </section>

      {/* SECTION 1: Яагаад ойлгоход хэцүү вэ? */}
      <section className="py-24 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              Яагаад "би муухай байна" гэж <br className="hidden sm:block" />
              <span className="text-blue-600">тодорхой хэлэхэд хэцүү вэ?</span>
            </h2>
            <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              Сэтгэл хөдлөл нь ганц шалтгаантай байдаггүй. 
              Нэг үйл явдал хүний дотор хэд хэдэн хэрэгцээ, 
              дурсамж, хүлээлтийг зэрэг өдөөдөг.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { 
                emoji: "😕", 
                label: "Бухимдсан мэт",
                desc: "Гэхдээ яг юунаас болж байгаа вэ?"
              },
              { 
                emoji: "😔", 
                label: "Гунигтай мэт",
                desc: "Эсвэл өөр зүйл үү?"
              },
              { 
                emoji: "😠", 
                label: "Ууртай мэт",
                desc: "Магадгүй энэ ч биш байх?"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-gray-100 text-center hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-bold text-lg mb-2">{item.label}</h3>
                <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-blue-50 rounded-3xl border-2 border-blue-100">
            <p className="text-gray-700 font-medium text-center leading-relaxed">
              Тиймээс бид яг аль нь гэдгээ тодорхой хэлж чаддаггүй. 
              <br className="hidden sm:block" />
              Олон хүчин зүйл зэрэг давхцаж байгаа учраас.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Хэрэгцээний түвшин */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              Хүн бүр <span className="text-purple-600">өөр өөр хэрэгцээндээ</span> <br className="hidden sm:block" />
              илүү мэдрэг байдаг
            </h2>
            <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              Сэтгэл хөдлөл "хоосон юм биш". Таны тухайн мөчийн хэрэгцээнээс 
              шалтгаалж төрөх мэдрэмж огт өөр болдог.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Heart className="text-rose-500" size={32} />,
                title: "Аюулгүй байдал",
                example: "Айдас → Сандарч байна",
                color: "from-rose-50 to-pink-50"
              },
              {
                icon: <Brain className="text-blue-500" size={32} />,
                title: "Хүлээн зөвшөөрөгдөх",
                example: "Гунигтай → Ганцаардаж байна",
                color: "from-blue-50 to-indigo-50"
              },
              {
                icon: <Sparkles className="text-amber-500" size={32} />,
                title: "Өөрийгөө үнэлэх",
                example: "Гутрал → Хүрээгүй байна",
                color: "from-amber-50 to-orange-50"
              },
              {
                icon: <TrendingUp className="text-emerald-500" size={32} />,
                title: "Өөрийгөө илэрхийлэх",
                example: "Хөөрөх → Чөлөөтэй байна",
                color: "from-emerald-50 to-teal-50"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 bg-gradient-to-br ${item.color} rounded-3xl border border-gray-100 hover:shadow-xl transition-all`}
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-black text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600 font-bold text-sm">{item.example}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 font-medium text-lg italic">
              "Одоо аль нь идэвхтэй байна вэ?" гэдгийг ойлгоход тусална
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Холимог мэдрэмжийг цэгцлэх */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              Ихэнх үед бид <br className="sm:hidden" />
              <span className="text-blue-600">2–5 мэдрэмжийг зэрэг</span> мэдэрдэг
            </h2>
            <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              Энэ холимог нь ойлгомжгүй, үгээр хэлэхэд хэцүү, 
              дотроо зөрчилтэй байдлыг үүсгэдэг.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Мэдрэмжүүдээ сонго",
                  desc: "Өөрт ойр байгаа 2-3 төлөвийг тодорхойл"
                },
                {
                  step: "02",
                  title: "Холимгийг хар",
                  desc: "Тэд хэрхэн холбогдож байгааг өнгө, зайгаар дүрсэл"
                },
                {
                  step: "03",
                  title: "Нэрлэж ойлго",
                  desc: "Одоогийн төлөвөө нэг өгүүлбэрээр тодорхой хүлээж ав"
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="aspect-square bg-gradient-to-br from-rose-100 via-blue-100 to-purple-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="text-center relative z-10">
                  <div className="text-7xl mb-4">🎨</div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-2">
                    Сэтгэл хөдлөлийг дүрслэх систем
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-[200px] mx-auto">
                    Өнгө, зайгаар ялгаж харуулна
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/30 via-transparent to-blue-200/30 blur-3xl" />
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-white rounded-3xl border-2 border-blue-100 text-center">
            <p className="text-gray-700 font-bold text-lg">
              Мэдрэмжүүдийг хоорондын холбоотой нь дүрслэн харуулах нь <br className="hidden sm:block" />
              <span className="text-blue-600">энэ зөрчлийг багасгадаг</span>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Ойлголт → Чиглэл */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              Сэтгэл хөдлөл өөрөө <br className="sm:hidden" />
              <span className="text-emerald-600">асуудал биш</span>
            </h2>
            <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              Харин түүнийг хэрхэн ойлгож, ямар түвшинд хүлээж авч байгаагаас 
              дараагийн алхам өөр болдог.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 bg-gray-50 rounded-3xl border-2 border-gray-200">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="font-black text-xl mb-4 text-gray-900">Зайлсхийх</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Ойлгохгүй үед мэдрэмж рүү эргэж очих эсвэл түүнээс зайлсхийхэд хүргэдэг
              </p>
            </div>

            <div className="p-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-200">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-black text-xl mb-4 text-emerald-900">Ойлголт</h3>
              <p className="text-emerald-900 font-medium leading-relaxed">
                Нэрлэж, хүлээн авснаар дараагийн боломжит чиглэл тодорхой болно
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-blue-600 text-white rounded-3xl text-center">
            <p className="text-xl font-bold leading-relaxed">
              Энэ ялгаа нь <span className="underline decoration-2 underline-offset-4">ойлголтын түвшинд</span> бий болдог
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Философи - Юу амлахгүй вэ */}
      <section className="py-24 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-8">Бид юу амлахгүй вэ</h2>
          
          <div className="space-y-4 mb-12">
            {[
              "Бид таныг засах гэж оролдохгүй",
              "Бид зөвлөгөө тулгахгүй",
              "Бид эмчилнэ гэж хэлэхгүй"
            ].map((text, i) => (
              <div key={i} className="flex items-center justify-center gap-3 text-gray-700 font-bold text-lg">
                <CheckCircle2 size={24} className="text-blue-600" />
                {text}
              </div>
            ))}
          </div>

          <div className="p-8 bg-white rounded-3xl border-2 border-blue-100">
            <p className="text-gray-900 font-bold text-xl leading-relaxed">
              Зөвхөн одоогийн төлөвийг <br className="sm:hidden" />
              <span className="text-blue-600">ойлгомжтой болгоход</span> тусална
            </p>
          </div>

          <div className="mt-12 inline-flex items-start gap-4 p-6 bg-amber-50 rounded-3xl text-left border-2 border-amber-200 max-w-xl">
            <Info size={24} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold text-amber-900 mb-1">Анхааруулга</p>
              <p className="text-sm font-medium text-amber-900">
                Энэ нь эмчилгээ биш. Өөрийгөө ойлгох, ажиглахад зориулсан хэрэгсэл юм.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              Одоогийн төлөвөө <br className="sm:hidden" />ойлгож үзэх үү?
            </h2>
            <p className="text-blue-100 font-medium mb-10 text-lg">
              2 минут. Бүртгэлгүй. Яг одоо.
            </p>
            <Link href="/register" className="inline-flex px-12 py-6 bg-white text-blue-600 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl">
              Эхлэх
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-gray-100 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Layers size={14} />
            </div>
            <span className="font-black">Mindful</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            © 2025 • Мэдрэмжийг нэрлэх нь ойлголт юм
          </p>
        </div>
      </footer>
    </div>
  );
}