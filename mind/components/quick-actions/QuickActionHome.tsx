'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Heart, Sparkles } from 'lucide-react';
import { QuickActionType } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  onSelectAction: (action: QuickActionType) => void;
}

export function QuickActionHome({ onSelectAction }: Props) {
  return (
    <div className="space-y-10 py-8">
      {/* Хамгийн дээд хэсэг - Угталт */}
      <div className="text-center space-y-3">
        {/* <div className="inline-flex p-2 bg-amber-50 rounded-full dark:bg-amber-950/20">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div> */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Сайна уу? ✨
        </h1>
        <p className="text-muted-foreground text-base max-w-[280px] mx-auto leading-relaxed">
          Өнөөдөр доторх ертөнцөө яаж илэрхийлмээр байна?
        </p>
      </div>

      {/* Сонголт хийх хэсэг */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto px-4">
        
        {/* Бодол тэмдэглэл */}
        <button
          onClick={() => onSelectAction('thought')}
          className="group relative flex flex-col items-center p-8 rounded-[2.5rem] bg-blue-50/50 dark:bg-blue-950/10 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 active:scale-95"
        >
          <div className="p-5 rounded-3xl bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-none mb-4 group-hover:rotate-6 transition-transform">
            <PenLine className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              Бодол бичих
            </h3>
            <p className="text-sm text-blue-600/70 dark:text-blue-400 font-medium">
              Тархиа суллах
            </p>
          </div>
        </button>

        {/* Сэтгэл хөдлөл */}
        <button
          onClick={() => onSelectAction('emotion')}
          className="group relative flex flex-col items-center p-8 rounded-[2.5rem] bg-rose-50/50 dark:bg-rose-950/10 border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-all duration-300 active:scale-95"
        >
          <div className="p-5 rounded-3xl bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-none mb-4 group-hover:-rotate-6 transition-transform">
            <Heart className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-1">
              Мэдрэмж ажиглах
            </h3>
            <p className="text-sm text-rose-600/70 dark:text-rose-400 font-medium">
              Зүрхээ сонсох
            </p>
          </div>
        </button>

      </div>

      {/* Footer - Жижигхэн зөвлөгөө */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground/40 font-medium tracking-widest uppercase">
          Зөвхөн танд зориулсан орон зай
        </p>
      </div>
    </div>
  );
}