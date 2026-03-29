// import { type Step } from 'react-joyride';
// // import type { TourType } from '@/contexts/TourContext';
// import { Sparkles, TriangleAlert, Target, MousePointerClick, Flame, Compass } from 'lucide-react';

// const iconClass = "inline-block mr-2 mb-0.5";

// const demoSteps: Step[] = [
//   // {
//   //   target: '[data-tour="demo-welcome"]',
//   //   title: <span className="flex items-center gap-2"><Sparkles size={18} className="text-violet-500" /> Тавтай морил!</span>,
//   //   content: 'Энэ бол таны дотоод бодлыг цэгцлэх ухаалаг тэмдэглэлийн апп. Хэдхэн алхмаар бодлоо задлан шинжилье.',
//   //   placement: 'bottom',
//   //   disableBeacon: true,
//   // },
//   // {
//   //   target: '[data-tour="demo-alert"]',
//   //   title: <span className="flex items-center gap-2"><TriangleAlert size={18} className="text-amber-500" /> Туршилтын горим</span>,
//   //   content: 'Та туршилтын горимд байна. Таний тэмдэглэл хадгалагдахгүй.',
//   //   placement: 'bottom',
//   //   disableBeacon: true,
//   // },
//   // {
//   //   target: '[data-tour="demo-actions"]',
//   //   title: <span className="flex items-center gap-2"><Target size={18} className="text-blue-500" /> Үйлдэл сонгох</span>,
//   //   content: 'Өнөөдөр юу мэдэрч байгаагаас хамааран нэгийг сонго. Сэтгэлийн зовиур, баяр хөөр, стресс — аль ч байсан ок!',
//   //   placement: 'bottom',
//   //   disableBeacon: true,
//   // },
//   // {
//   //   target: '[data-tour="demo-action-0"]',
//   //   title: <span className="flex items-center gap-2"><MousePointerClick size={18} className="text-green-500" /> Энд дарж эхэл</span>,
//   //   content: 'Товч дарахад 3 алхмын асуулт гарч ирнэ. Чин сэтгэлээсээ хариулаарай — энэ зөвхөн чиний хувьд.',
//   //   placement: 'bottom',
//   //   disableBeacon: true,
//   // },
//   // {
//   //   target: '[data-tour="demo-help-0"]',
//   //   title: <span className="flex items-center gap-2"><Target size={18} className="text-blue-500" /> Асуулт унших</span>,
//   //   content: 'Энд асуулт байрлах ба та өөрийнд орж ирсэн эхний бодлыг л бичнэ. Бусад зүйлсийг дараа нь авч үзэх болно.',
//   //   placement: 'bottom',
//   //   disableBeacon: true,
//   // },
// ];

// export default function getTourSteps(tourType: TourType): Step[] {
//   switch (tourType) {
//     case 'demo': return demoSteps;
//     default:     return [];
//   }
// }