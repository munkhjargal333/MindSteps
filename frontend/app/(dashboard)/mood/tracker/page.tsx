// // ================================================
// // 8. MOOD TRACK PAGE - app/(dashboard)/mood/track/page.tsx
// // ================================================
// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useAuth } from '../../../../context/AuthContext';
// import { apiClient } from '../../../../lib/api/client';
// import { Mood, MoodCategory } from '../../../../lib/types';
// import { useRouter } from 'next/navigation';


// export default function MoodTrackPage() {
//   const { token } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState<MoodCategory[]>([]);
//   const [moods, setMoods] = useState<Mood[]>([]);
//   const [selectedMood, setSelectedMood] = useState<number | null>(null);
//   const [intensity, setIntensity] = useState(5);
//   const [whenFelt, setWhenFelt] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
//   const [trigger, setTrigger] = useState('');
//   const [coping, setCoping] = useState('');
//   const [notes, setNotes] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (token) {
//       loadMoodData();
//     }
//   }, [token]);

//   const loadMoodData = async () => {
//     if (!token) return;
    
//     try {
//       const [categoriesData, moodsData] = await Promise.all([
//         apiClient.getMoodCategories(token),
//         apiClient.getMoods(token),
//       ]);
//       setCategories(categoriesData);
//       setMoods(moodsData);
//     } catch (error) {
//       console.error('Error loading mood data:', error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token || !selectedMood) return;

//     setLoading(true);
//     setError('');

//     try {
//       await apiClient.createMoodEntry({
//         entry_date: new Date().toISOString().split('T')[0],
//         mood_id: selectedMood,
//         intensity,
//         when_felt: whenFelt,
//         trigger_event: trigger || undefined,
//         coping_strategy: coping || undefined,
//         notes: notes || undefined,
//       }, token);

//       router.push('/mood');
//     } catch (err: any) {
//       setError(err.message || 'Сэтгэл санаа хадгалахад алдаа гарлаа');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCurrentTime = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'morning';
//     if (hour < 17) return 'afternoon';
//     if (hour < 21) return 'evening';
//     return 'night';
//   };

//   useEffect(() => {
//     setWhenFelt(getCurrentTime());
//   }, []);

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <div className="bg-white rounded-2xl shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Сэтгэл санаа тэмдэглэх</h1>
//         <p className="text-gray-600 mb-8">Өнөөдөр ямар санагдаж байна?</p>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Mood Selection */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-900 mb-4">
//               Сэтгэл санаагаа сонгоно уу
//             </label>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {moods.map((mood) => (
//                 <button
//                   key={mood.id}
//                   type="button"
//                   onClick={() => setSelectedMood(mood.id)}
//                   className={`p-4 rounded-xl border-2 transition ${
//                     selectedMood === mood.id
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="text-3xl mb-2">{mood.emoji}</div>
//                   <div className="text-sm font-medium text-gray-900">{mood.name}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Intensity */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-900 mb-4">
//               Эрчим: {intensity}/10
//             </label>
//             <input
//               type="range"
//               min="1"
//               max="10"
//               value={intensity}
//               onChange={(e) => setIntensity(Number(e.target.value))}
//               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//             />
//             <div className="flex justify-between text-xs text-gray-500 mt-2">
//               <span>Сул</span>
//               <span>Дунд</span>
//               <span>Хүчтэй</span>
//             </div>
//           </div>

//           {/* When Felt */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-900 mb-4">
//               Хэзээ мэдэрсэн бэ?
//             </label>
//             <div className="grid grid-cols-4 gap-3">
//               {[
//                 { value: 'morning', label: 'Өглөө', emoji: '🌅' },
//                 { value: 'afternoon', label: 'Өдөр', emoji: '☀️' },
//                 { value: 'evening', label: 'Орой', emoji: '🌆' },
//                 { value: 'night', label: 'Шөнө', emoji: '🌙' },
//               ].map((time) => (
//                 <button
//                   key={time.value}
//                   type="button"
//                   onClick={() => setWhenFelt(time.value as any)}
//                   className={`p-3 rounded-lg border-2 transition ${
//                     whenFelt === time.value
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="text-2xl mb-1">{time.emoji}</div>
//                   <div className="text-xs font-medium">{time.label}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Trigger */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Юунаас болж ийм мэдрэмж төрсөн бэ? (заавал биш)
//             </label>
//             <textarea
//               value={trigger}
//               onChange={(e) => setTrigger(e.target.value)}
//               rows={3}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//               placeholder="Жишээ нь: Ажил дээр сайн мэдээ сонссон..."
//             />
//           </div>

//           {/* Coping Strategy */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Хэрхэн даван туулсан бэ? (заавал биш)
//             </label>
//             <textarea
//               value={coping}
//               onChange={(e) => setCoping(e.target.value)}
//               rows={3}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//               placeholder="Жишээ нь: Амьсгалын дасгал хийсэн..."
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Нэмэлт тэмдэглэл (заавал биш)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               rows={3}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//               placeholder="Бусад тэмдэглэл..."
//             />
//           </div>

//           <div className="flex gap-4 pt-4">
//             <button
//               type="submit"
//               disabled={loading || !selectedMood}
//               className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Хадгалж байна...' : 'Хадгалах'}
//             </button>
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
//             >
//               Болих
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
