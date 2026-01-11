'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Copyright, HeartPulse, UserCircle } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      icon: <HeartPulse size={20} className="text-blue-500" />,
      title: "1. Үйлчилгээний мөн чанар",
      content: "Mindful нь танин мэдэхүй, хувийн хөгжлийн мэдээлэл түгээх зорилготой платформ юм. Бид мэргэжлийн сэтгэл засалч, анагаах ухааны оношилгоо, эмчилгээний үйлчилгээ үзүүлэгч биш болно. Хэрэв танд сэтгэл зүйн хүндрэлтэй асуудал тулгарсан бол мэргэжлийн эмчид хандахыг зөвлөж байна."
    },
    {
      icon: <Copyright size={20} className="text-purple-500" />,
      title: "2. Оюуны өмч ба Зохиогчийн эрх",
      content: "Апп доторх бүх эх бичвэр, график, код болон дизайн нь Mindful-ийн өмч бөгөөд зохиогчийн эрхээр хамгаалагдсан. Таны бичсэн тэмдэглэл, бодол болон хувийн өгөгдөл нь зөвхөн 'Таны өмч' байна. Бид таны зөвшөөрөлгүйгээр таны хувийн тэмдэглэлийг ашиглахгүй."
    },
    {
      icon: <UserCircle size={20} className="text-indigo-500" />,
      title: "3. Хэрэглэгчийн хариуцлага",
      content: "Та өөрийн бүртгэл болон нууц үгийн аюулгүй байдлыг хариуцна. Өөрийн бүртгэлийг бусдад дамжуулахгүй байх, хууль бус зорилгоор апп-ыг ашиглахгүй байх үүргийг хэрэглэгч хүлээнэ."
    },
    {
      icon: <ShieldCheck size={20} className="text-green-500" />,
      title: "4. Үйлчилгээний өөрчлөлт",
      content: "Бид үйлчилгээгээ сайжруулах зорилгоор апп-ын зарим функцийг хэдийд ч өөрчлөх, шинэчлэх эрхтэй. Нөхцөлд томоохон өөрчлөлт орсон тохиолдолд танд и-мэйлээр мэдэгдэх болно."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-800 font-light">
      {/* Дээд хэсэг (Navigation) */}
      <nav className="max-w-3xl mx-auto px-6 py-10 flex items-center justify-between">
        <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-[0.2em]">Буцах</span>
        </Link>
        <div className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-bold">
          Legal Document / 2026
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        {/* Толгой хэсэг */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4 text-gray-900">
            Үйлчилгээний нөхцөл
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Сүүлд шинэчилсэн: 2026 оны 1-р сарын 11. <br />
            Mindful платформыг ашиглахаас өмнө эдгээр нөхцөлүүдтэй анхааралтай танилцана уу.
          </p>
        </motion.div>

        {/* Секцүүд */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                  {section.icon}
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-500 leading-[1.8] text-[15px] pl-11">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Төгсгөл */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 pt-12 border-t border-gray-100 text-center"
        >
          {/* <p className="text-gray-400 text-xs italic">
            Асуух зүйл байвал <a href="mailto:support@mindful.mn" className="text-blue-500 hover:underline">support@mindful.mn</a> хаягаар холбогдоно уу.
          </p> */}
        </motion.div>
      </main>
    </div>
  );
}