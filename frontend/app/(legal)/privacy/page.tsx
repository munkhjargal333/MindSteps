'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Lock, EyeOff, Database, Share2 } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Database size={20} className="text-blue-500" />,
      title: "1. Мэдээлэл цуглуулах",
      content: "Бид таныг бүртгүүлэх үед и-мэйл хаяг болон нэрийг тань авдаг. Мөн таны апп дотор бичсэн тэмдэглэл, бодол болон хувийн хөгжлийн явцыг зөвхөн танд зориулан манай өгөгдлийн санд нууцлалтайгаар хадгална."
    },
    {
      icon: <Lock size={20} className="text-purple-500" />,
      title: "2. Мэдээллийн аюулгүй байдал",
      content: "Таны бүх өгөгдөл орчин үеийн шифрлэлтийн (encryption) технологиор хамгаалагдана. Бид таны нууц үгийг хэзээ ч шууд текстээр хадгалдаггүй бөгөөд зөвхөн таныг нэвтрэх эрхтэй байх бүх боломжийг хангадаг."
    },
    {
      icon: <Share2 size={20} className="text-indigo-500" />,
      title: "3. Гуравдагч талд дамжуулах",
      content: "Mindful нь хэрэглэгчийн хувийн мэдээлэл болон тэмдэглэлийг хэзээ ч зарж борлуулахгүй, маркетинг болон сурталчилгааны зорилгоор бусдад дамжуулахгүй. Таны өгөгдөл зөвхөн таны апп-ын туршлагыг сайжруулахад ашиглагдана."
    },
    {
      icon: <EyeOff size={20} className="text-green-500" />,
      title: "4. Таны эрх",
      content: "Та хүссэн үедээ өөрийн мэдээллийг шинэчлэх, устгах эрхтэй. Хэрэв та бүртгэлээ устгахаар шийдвэл таны бүх тэмдэглэл болон хувийн мэдээлэл манай серверээс бүрмөсөн устах болно."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-800 font-light">
      <nav className="max-w-3xl mx-auto px-6 py-10 flex items-center justify-between">
        <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-[0.2em]">Буцах</span>
        </Link>
        <div className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-bold">
          Privacy Policy / 2026
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4 text-gray-900">
            Нууцлалын бодлого
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Таны хувийн орон зай манайд аюулгүй. <br />
            Бид таны итгэлийг хамгаалахын тулд мэдээллийн нууцлалыг дээд зэргээр хангадаг.
          </p>
        </motion.div>

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

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 pt-12 border-t border-gray-100 text-center"
        >
          <p className="text-gray-400 text-[11px] uppercase tracking-widest">
            Mindful — Таны дотоод ертөнцийн хамгаалагч
          </p>
        </motion.div>
      </main>
    </div>
  );
}