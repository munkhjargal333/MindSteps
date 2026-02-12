'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Star,
  Mail,
  Crown,
  ChevronRight
} from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden"
        >
          {/* Header Section */}
          <div className="pt-12 pb-8 px-8 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl mb-6 shadow-lg shadow-indigo-200"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Mindstep <span className="text-indigo-600 font-bold">Founders Club</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Ирээдүйн платформыг хамт бүтээлцэх <br />
              <span className="text-slate-900">алсын хараатай түншүүдийг хайж байна</span>
            </p>
          </div>

          {/* Core Benefits Card */}
          <div className="mx-6 p-6 bg-slate-900 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={40} className="text-white" />
            </div>
            
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1 h-1 bg-indigo-400 rounded-full" /> АНХДАГЧ-уудийн давуу тал
            </h4>

            <div className="space-y-3">
              {[
                'Зөвхөн хэрэглэгч биш, хамт бүтээгч байх орон зай',
                'Платформын хөгжил, стратегийн чиглэлийг хамт тодорхойлох',
                'Хөнгөлөлт, урамшуулал, зөвхөн гишүүдэд зориулсан саналууд',
                'Ирээдүйд оролцооны хэлбэрээр хувь хүртэх боломж',
                'Дотоод хүрээний уулзалт, эвентүүдэд урилгаар оролцох'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-[12.5px] text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Selection */}
          <div className="p-6 space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-2">Боломжит түвшнүүд</p>
            
            {/* Tiers List */}
            <div className="space-y-2">
              <TierItem 
                icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />} 
                title="ANGEL" 
                desc="Хөрөнгө оруулагч, стратегийн түнш"
                color="amber"
              />

              <TierItem 
                icon={<Sparkles className="w-5 h-5 text-emerald-500" />} 
                title="FIRST100" 
                desc="Үнэгүй • 98 суудал үлдсэн"
                color="emerald"
                isSpecial
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-8 space-y-3">
            <a
              href="mailto:munkhjargal.ts39@gmail.com"
              className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-900 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-[0.98]"
            >
              <Mail className="w-4 h-4" />
              Email илгээх
            </a>

            <a
              href="https://www.facebook.com/tenger.uhaan"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              Facebook холбогдох
            </a>

            <button
              onClick={() => (window.location.href = '/login')}
              className="w-full text-sm text-slate-500 font-medium hover:text-indigo-600 transition flex items-center justify-center gap-2 pt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Нэвтрэх хэсэг рүү буцах
            </button>
          </div>
        </motion.div>
        
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Mindful Platform. Бүх эрх хуулиар хамгаалагдсан.
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> • </span>
                Улаанбаатар, Монгол
              </p>
            </div>
      </div>
    </div>
  );
}

function TierItem({ icon, title, desc, color, isSpecial = false }: any) {
  const colors: any = {
    amber: "bg-amber-50 border-amber-100",
    rose: "bg-rose-50 border-rose-100",
    emerald: "bg-emerald-50 border-emerald-100",
  };

  return (
    <div className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all cursor-default ${colors[color]} hover:shadow-sm`}>
      <div className="shrink-0">{icon}</div>
      <div className="flex-1">
        <h3 className="text-[13px] font-bold text-slate-900 leading-none mb-1">{title}</h3>
        <p className="text-[11px] text-slate-500 font-medium">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </div>
  );
}