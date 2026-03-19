// lib/config/tourSteps.ts
'use client';

import { Step } from 'react-joyride';
import { TourType } from '@/context/TourContext';
import React from 'react';
import { 
  Sparkles, Trophy, TrendingUp, BookOpen, 
  Navigation, Diamond, Plus, Tag, 
  FileText, Heart, Zap 
} from 'lucide-react';

function getTourSteps(tourType: TourType): Step[] {
  const tours: Record<TourType, Step[]> = {
    dashboard: [
      {
        target: 'body',
        content: (
          <div className="text-center py-2">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-black mb-3">Тавтай морил!</h3>
            <p className="text-slate-600 leading-relaxed">
              Mindful системд тавтай морилно уу! Та өөрийн сэтгэл санаа, хөгжил, үнэт зүйлсээ хянах боломжтой.
            </p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      {
        target: '[data-tour="gamification-hero"]',
        content: (
          <div>
            <Trophy className="w-6 h-6 mb-3 text-yellow-500" />
            <h4 className="text-base font-bold mb-2">Таны Явц</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Энд таны Level, нийт оноо, болон цувааг харна. Өдөр бүр идэвхтэй байснаар streak-ээ нэмэгдүүлээрэй!
            </p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '[data-tour="activity-card"]',
        content: (
          <div>
            <TrendingUp className="w-6 h-6 mb-3 text-green-500" />
            <h4 className="text-base font-bold mb-2">Миний Идэвх</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Нийт тэмдэглэл болон сэтгэл санааны бичлэгүүдийн тоог энд харна.
            </p>
          </div>
        ),
        placement: 'right',
      },
      {
        target: '[data-tour="progress-card"]',
        content: (
          <div>
            <BookOpen className="w-6 h-6 mb-3 text-purple-500" />
            <h4 className="text-base font-bold mb-2">Мэдлэгийн Явц</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Та ангилал бүрт ямар хичээлүүдийг дуусгасан болон үлдсэнийг энд хянана.
            </p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: 'nav',
        content: (
          <div>
            <Navigation className="w-6 h-6 mb-3 text-blue-500" />
            <h4 className="text-base font-bold mb-2">Цэс</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Цэснээс Мэдлэг, Үнэт зүйл, Сэтгэл, Бодол гэх мэт хэсгүүд рүү шилжинэ.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
    ],

    coreValues: [
      {
        target: 'body',
        content: (
          <div className="text-center py-2">
            <Diamond className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-black mb-3">Үнэт Зүйлс</h3>
            <p className="text-slate-600 leading-relaxed">
              Маслоугийн шаталлын дагуу өөрийн үнэт зүйлсээ зохион байгуул. 
              Та амьдралынхаа ямар зүйлд ач холбогдол өгдгөө тодорхойл.
            </p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      {
        target: 'button:has(span:contains("Үнэт зүйл нэмэх"))',
        content: (
          <div>
            
          </div>
        ),
        placement: 'bottom',
      },
    ],

    lessons: [
      {
        target: 'body',
        content: (
          <div className="text-center py-2">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-black mb-3">Мэдлэгийн Сан</h3>
            <p className="text-slate-600 leading-relaxed">
              Сэтгэл зүйн олон төрлийн хичээлүүдээс суралцаарай. 
              Ангилал, дэд ангилалаар эрэмбэлэгдсэн.
            </p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      {
        target: 'body',
        content: (
          <div>
            <Tag className="w-6 h-6 mb-3 text-blue-500" />
            <h4 className="text-base font-bold mb-2">Үндсэн Ангилал</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Эхлээд үндсэн ангилал сонгоно. Жишээ: Сэтгэл хөдлөл, Харилцаа, гэх мэт.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
    ],

    mood: [
      {
        target: 'body', // Дэлгэцийн голд харуулах бол 'body' ашиглах нь тохиромжтой
        content: (
          <div className="text-center py-4 px-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Heart className="w-12 h-12 text-rose-500 animate-pulse" />
                <Zap className="w-6 h-6 text-yellow-400 absolute -right-2 -top-1" />
              </div>
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-800">Мэдрэмж</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Мэдрэмж бол бодит байдалд үйлдэл хийхэд зориулж танд өгөгдсөн <strong>эрчим</strong> юм. 
                <br /><br />
                Угтаа мэдрэмж нь тайлагдах гэж биш, харин үйлдэлд хөтлөх гэж үүсдэг. 
                Гэвч бид бодит байдлыг гажуудуулж хүлээн авснаар "буруу" мэдрэмжүүд үүсэж, 
                тэдгээр нь бидэнд дарамт болж хувирдаг.
            </p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      {
        target: 'body', // Энэ хэсэгт тухайн цэсний selector-ыг бичнэ
        content: (
          <div className="p-1">
            <Plus className="w-6 h-6 mb-3 text-purple-500" />
            <p className="text-sm text-slate-600 leading-relaxed">
              Мэдрэмжийн үүсэл болон чиглэлийн талаар илүү гүнзгий мэдэхийг хүсвэл 
              <span className="text-purple-600 font-bold"> "Мэдлэг"</span> цэсний эхний бүлгийг уншаарай.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
    ],

    journal: [
      {
        target: '',
        content: (
        <div className="p-1">
          <FileText className="w-6 h-6 mb-3 text-blue-500" />
          <h4 className="text-base font-bold mb-2">Шинэ Тэмдэглэл</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Хэрвээ бодолын бүтэц, зорилгын талаар илүү мэдэхийг хүсвэл 
            <strong> "Мэдлэг"</strong> цэсний эхний бүлгийг уншаарай.
          </p>
        </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      {
        target: '',
        content: (
          <div>
            <FileText className="w-6 h-6 mb-3 text-blue-500" />
            <h4 className="text-base font-bold mb-2">Шинэ Тэмдэглэл</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Хэрвээ илүү ихийг мэдмээр байвал Мэдлэг цэсний эхний бүлгийг уншаарай
            </p>
          </div>
        ),
        placement: 'bottom',
      },
    ],
  };

  return tours[tourType] || [];
}

export default getTourSteps;