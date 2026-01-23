'use client';

import React from 'react';
import {
  Lock,
  ArrowLeft,
  Heart,
  Sparkles,
  MessageCircle,
  Award,
  CheckCircle2,
  Star,
  Mail
} from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">

          {/* HEADER */}
          <div className="p-6 md:p-10 text-center relative">
            <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-blue-100/40 to-transparent blur-2xl" />

            <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl mb-4 shadow-sm">
              <Lock className="w-7 h-7 text-red-500" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
              Mindstep Early Access
            </h1>

            <p className="text-[13px] text-slate-500 leading-relaxed px-3 mb-6">
              Систем одоогоор <strong>хаалттай Beta</strong> хөгжүүлэлт дээр байна.
              <br />
              <span className="text-slate-700 font-semibold">
                Зөвхөн сонгогдсон хэрэглэгчид нэвтрэх боломжтой.
              </span>
            </p>

            {/* BENEFITS */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 mb-6 text-left border border-blue-100">
              <h4 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Early access давуу тал
              </h4>

              <ul className="space-y-2">
                {[
                  'Системийн хөгжүүлэлтэд шууд санал нөлөө үзүүлэх',
                  'Нэг удаагийн дэмжлэг — дахин төлбөргүй',
                  'Ирээдүйн PRO хувилбар дээр lifetime хөнгөлөлт',
                  'Founder / Early Builder badge'
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[11px] text-slate-600 font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* TIERS */}
            <div className="grid gap-3 mb-8">
              {/* ANGEL */}
              <div className="group flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50/50 to-white border border-amber-200 rounded-2xl">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900 text-[12px] flex items-center gap-1">
                    ANGEL <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Хөрөнгө оруулагч, стратегийн түнш
                  </p>
                </div>
              </div>

              {/* TOP100 */}
              <div className="group flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900 text-[12px]">TOP100 Дэмжигч</h3>
                  <p className="text-[10px] text-slate-500 leading-tight font-medium">
                    100,000₮ - Насан туршийн эрх
                  </p>
                </div>
              </div>

              {/* HELLO1000 */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <Heart className="w-9 h-9 text-blue-500 shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold text-slate-900 text-[13px]">
                    HELLO1000
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    100,000₮ ба түүнээс дээш • Early Beta
                  </p>
                </div>
              </div>

              {/* FIRST20 */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-2xl">
                <Sparkles className="w-9 h-9 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold text-slate-900 text-[13px]">
                    FIRST20
                  </h3>
                  <p className="text-[10px] text-emerald-700">
                    Үнэгүй • Анхны 20 хэрэглэгч
                  </p>
                </div>
              </div>

            </div>

            {/* CONTACT */}
            <div className="space-y-2">
              <a
                href="mailto:munkhjargal.ts39@gmail.com"
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition"
              >
                <Mail className="w-4 h-4" />
                Founder-т email бичих
              </a>

              <a
                href="https://www.facebook.com/tenger.uhaan"
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-[#1877F2] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Facebook-р холбогдох
              </a>
            </div>

            {/* BACK */}
            <button
              onClick={() => (window.location.href = '/login')}
              className="mt-6 text-[11px] text-slate-400 font-medium hover:text-slate-600 flex items-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" />
              Өөр хаягаар нэвтрэх
            </button>
          </div>

          {/* FOOTER */}
          <div className="bg-slate-50 py-3 border-t border-slate-100">
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
              Mindstep • Early Builders Program
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
