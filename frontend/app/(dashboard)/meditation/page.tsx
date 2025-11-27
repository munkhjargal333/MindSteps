'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, SkipForward } from 'lucide-react';

// Types
interface Exercise {
  hz: number;
  color: string;
  name: string;
  affirmation_mn: string;
  affirmation_en: string;
  breathing: string;
  visualization: string;
  duration: number;
}

interface HawkinsLevel {
  name: string;
  score: number;
  emoji: string;
}

interface MaslowLevel {
  value: string;
  label: string;
  icon: string;
}

type ExerciseKey = 
  | 'Fear-safety'
  | 'Fear-physiological'
  | 'Anger-esteem'
  | 'Anger-love_belonging'
  | 'Courage-esteem'
  | 'Courage-safety'
  | 'Love-love_belonging'
  | 'Love-self_actualization'
  | 'Joy-self_actualization'
  | 'Joy-love_belonging'
  | 'Peace-self_actualization';

type ExerciseDatabase = Record<ExerciseKey, Exercise>;

type PhaseType = 'intro' | 'breathing' | 'affirmation' | 'silence' | 'outro';

export default function ExerciseGenerator() {
  const [hawkinsLevel, setHawkinsLevel] = useState<string>('Fear');
  const [maslowLevel, setMaslowLevel] = useState<string>('safety');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<PhaseType>('intro');
  const [countdown, setCountdown] = useState<number>(0);
  const [affirmationIndex, setAffirmationIndex] = useState<number>(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const exerciseDatabase: ExerciseDatabase = {
    'Fear-safety': {
      hz: 396,
      color: '#FF6B6B',
      name: 'Айдсаас чөлөөлөх',
      affirmation_mn: 'Би энэ мөчид аюулгүй байна. Миний биед итгэл найдвар байна.',
      affirmation_en: 'I am safe in this moment. I trust my body.',
      breathing: '4-7-8 (4 сек татах, 7 сек барих, 8 сек гаргах)',
      visualization: 'Өөрийгөө гэрэлт бөмбөлөг хүрээлсэн байхаар төсөөлөх',
      duration: 10
    },
    'Fear-physiological': {
      hz: 174,
      color: '#8B4513',
      name: 'Биеийн аюулгүй байдал',
      affirmation_mn: 'Миний бие хүчтэй, эрүүл. Би өөртөө итгэдэг.',
      affirmation_en: 'My body is strong and healthy. I trust myself.',
      breathing: '4-4-4-4 (Box breathing)',
      visualization: 'Биеийнхээ бүх эрхтнийг өөдрөг гэрлээр дүүргэх',
      duration: 8
    },
    'Anger-esteem': {
      hz: 528,
      color: '#FFD93D',
      name: 'Хайр ба засварлалт',
      affirmation_mn: 'Би өөрийн сэтгэл хөдлөлөө ойлгож, эвтэйхэн илэрхийлж байна.',
      affirmation_en: 'I understand my emotions and express them peacefully.',
      breathing: 'Box breathing (4-4-4-4)',
      visualization: 'Уурыг улаан утаагаар газарт урсах мэт төсөөлөх',
      duration: 10
    },
    'Anger-love_belonging': {
      hz: 639,
      color: '#FF9999',
      name: 'Харилцаа сэргээх',
      affirmation_mn: 'Би бусдыг ойлгож, өршөөнгүй хандаж байна.',
      affirmation_en: 'I understand others and approach with compassion.',
      breathing: '4-7-8',
      visualization: 'Зүрхнээс гэрэл цацруулж буй дүр төрх',
      duration: 10
    },
    'Courage-esteem': {
      hz: 741,
      color: '#6BCF7F',
      name: 'Өөрийгөө илэрхийлэх',
      affirmation_mn: 'Би өөртөө итгэлтэй, чадварлаг хүн. Би зорилгодоо хүрч чадна.',
      affirmation_en: 'I am confident and capable. I can achieve my goals.',
      breathing: 'Box breathing (4-4-4-4)',
      visualization: 'Өөрийгөө уулын оройд зогсож байхаар төсөөлөх',
      duration: 10
    },
    'Courage-safety': {
      hz: 417,
      color: '#FF8C42',
      name: 'Өөрчлөлтийн зориг',
      affirmation_mn: 'Би өөрчлөлтөд бэлэн. Би шинэ эхлэлд нээлттэй.',
      affirmation_en: 'I am ready for change. I am open to new beginnings.',
      breathing: '4-7-8',
      visualization: 'Хуучин хүндийг салгаж, шинийг угтах',
      duration: 10
    },
    'Love-love_belonging': {
      hz: 639,
      color: '#FF8DC7',
      name: 'Харилцаа холбоо',
      affirmation_mn: 'Би бүхэнтэй нэгдмэл, хайраар дүүрэн. Миний зүрх нээлттэй.',
      affirmation_en: 'I am one with all, filled with love. My heart is open.',
      breathing: 'Байгалийн амьсгал',
      visualization: 'Зүрхнээсээ ягаан гэрэл цацарч байхыг төсөөлөх',
      duration: 12
    },
    'Love-self_actualization': {
      hz: 528,
      color: '#FFB6C1',
      name: 'Нэгдмэл хайр',
      affirmation_mn: 'Би бүх амьтантай холбогдсон. Миний хайр хязгааргүй.',
      affirmation_en: 'I am connected to all beings. My love is limitless.',
      breathing: 'Байгалийн амьсгал',
      visualization: 'Орчин ертөнцтөө хайраар холбогдох',
      duration: 15
    },
    'Joy-self_actualization': {
      hz: 852,
      color: '#A8E6CF',
      name: 'Оюун санааны гэгээрэлт',
      affirmation_mn: 'Би энэ мөчийн гайхамшигт талархаж байна. Амьдрал бол баясгалан.',
      affirmation_en: 'I am grateful for this moment. Life is joy.',
      breathing: 'Байгалийн амьсгал',
      visualization: 'Өөрийгөө гэрлэн манан дотор усардах мэт төсөөлөх',
      duration: 12
    },
    'Joy-love_belonging': {
      hz: 528,
      color: '#FFE66D',
      name: 'Хамтын баяр',
      affirmation_mn: 'Миний баяр баясгалан бусадтай хуваалцагддаг.',
      affirmation_en: 'My joy is shared with others.',
      breathing: 'Байгалийн амьсгал',
      visualization: 'Баясгаланг бусадтай хуваалцах',
      duration: 10
    },
    'Peace-self_actualization': {
      hz: 963,
      color: '#C7A8FF',
      name: 'Тэнгэрлэг холбоо',
      affirmation_mn: 'Би төгс амар тайван байна. Бүх зүйл яг байх ёстой байдлаараа.',
      affirmation_en: 'I am perfectly peaceful. All is as it should be.',
      breathing: 'Байгалийн амьсгал',
      visualization: 'Хоосон огторгуйд амрах',
      duration: 15
    }
  };

  const hawkinsLevels: HawkinsLevel[] = [
    { name: 'Shame', score: 20, emoji: '😔' },
    { name: 'Guilt', score: 30, emoji: '😞' },
    { name: 'Fear', score: 100, emoji: '😰' },
    { name: 'Anger', score: 150, emoji: '😠' },
    { name: 'Courage', score: 200, emoji: '💪' },
    { name: 'Acceptance', score: 350, emoji: '🙏' },
    { name: 'Love', score: 500, emoji: '❤️' },
    { name: 'Joy', score: 540, emoji: '😊' },
    { name: 'Peace', score: 600, emoji: '☮️' }
  ];

  const maslowLevels: MaslowLevel[] = [
    { value: 'physiological', label: 'Бие махбод', icon: '🫀' },
    { value: 'safety', label: 'Аюулгүй байдал', icon: '🛡️' },
    { value: 'love_belonging', label: 'Хайр ба харьяалал', icon: '❤️' },
    { value: 'esteem', label: 'Өөртөө үнэлэлт', icon: '⭐' },
    { value: 'self_actualization', label: 'Өөрийгөө хэрэгжүүлэх', icon: '🌟' }
  ];

  const generateExercise = () => {
    const key = `${hawkinsLevel}-${maslowLevel}` as ExerciseKey;
    const ex = exerciseDatabase[key];
    
    if (ex) {
      setExercise(ex);
    } else {
      // Fallback логик
      const fallbackKey = (Object.keys(exerciseDatabase) as ExerciseKey[])
        .find(k => k.startsWith(hawkinsLevel));
      setExercise(fallbackKey ? exerciseDatabase[fallbackKey] : exerciseDatabase['Fear-safety']);
    }
    setCurrentPhase('intro');
    setAffirmationIndex(0);
  };

  const startTone = (frequency: number) => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      
      const ctx = audioContextRef.current;
      
      oscillatorRef.current = ctx.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.setValueAtTime(0.2, ctx.currentTime);
      
      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(ctx.destination);
      
      oscillatorRef.current.start();
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // ignore
      }
      oscillatorRef.current = null;
    }
  };

  const startExercise = () => {
    setIsPlaying(true);
    setCurrentPhase('breathing');
    setCountdown(5);
    if (exercise) {
      startTone(exercise.hz);
    }
  };

  const pauseExercise = () => {
    setIsPlaying(false);
    stopTone();
  };

  const skipToNext = () => {
    if (currentPhase === 'breathing') {
      setCurrentPhase('affirmation');
      setAffirmationIndex(0);
      setCountdown(4);
    } else if (currentPhase === 'affirmation') {
      if (affirmationIndex < 4) {
        setAffirmationIndex(prev => prev + 1);
        setCountdown(4);
      } else {
        setCurrentPhase('silence');
        setCountdown(20);
      }
    } else if (currentPhase === 'silence') {
      setCurrentPhase('outro');
      setCountdown(3);
      stopTone();
    } else {
      setIsPlaying(false);
      setExercise(null);
      stopTone();
    }
  };

  useEffect(() => {
    if (!isPlaying || countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          skipToNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, countdown, currentPhase, affirmationIndex]);

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🧘‍♀️ Эдгээх Бясалгал
            </h1>
            <p className="text-gray-600 text-sm">Hawkins + Maslow + Hz Therapy</p>
          </div>

          {!exercise && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  1️⃣ Hawkins Түвшин
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {hawkinsLevels.map(level => (
                    <button
                      key={level.name}
                      onClick={() => setHawkinsLevel(level.name)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        hawkinsLevel === level.name
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{level.emoji}</div>
                      <div className="font-semibold text-xs">{level.name}</div>
                      <div className="text-xs text-gray-500">{level.score}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  2️⃣ Maslow Түвшин
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {maslowLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setMaslowLevel(level.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        maslowLevel === level.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-xl mr-2">{level.icon}</span>
                      <span className="font-medium text-sm">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateExercise}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                🎵 Бясалгал үүсгэх
              </button>
            </div>
          )}

          {exercise && !isPlaying && (
            <div className="space-y-4">
              <div 
                className="p-6 rounded-2xl text-white"
                style={{ backgroundColor: exercise.color }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{exercise.hz} Hz</h2>
                    <p className="text-sm opacity-90">{exercise.name}</p>
                  </div>
                  <Volume2 size={40} />
                </div>
                
                <div className="bg-white/20 backdrop-blur p-4 rounded-xl space-y-2">
                  <div className="font-semibold text-sm">📖 Баталгаа:</div>
                  <div className="text-base">{exercise.affirmation_mn}</div>
                  <div className="text-xs opacity-80 italic">{exercise.affirmation_en}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="font-semibold text-gray-700 text-sm mb-1">🫁 Амьсгал:</div>
                  <div className="text-xs">{exercise.breathing}</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-xl">
                  <div className="font-semibold text-gray-700 text-sm mb-1">🎨 Төсөөлөл:</div>
                  <div className="text-xs">{exercise.visualization}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={startExercise}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Эхлүүлэх
                </button>
                
                <button
                  onClick={() => setExercise(null)}
                  className="px-6 py-3 bg-gray-200 rounded-xl font-semibold"
                >
                  Буцах
                </button>
              </div>
            </div>
          )}

          {exercise && isPlaying && (
            <div className="space-y-6">
              <div 
                className="p-8 rounded-2xl text-white text-center"
                style={{ backgroundColor: exercise.color }}
              >
                <div className="text-5xl mb-4">
                  {currentPhase === 'breathing' && '🫁'}
                  {currentPhase === 'affirmation' && '📖'}
                  {currentPhase === 'silence' && '🧘‍♀️'}
                  {currentPhase === 'outro' && '✨'}
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {currentPhase === 'breathing' && 'Амьсгал'}
                  {currentPhase === 'affirmation' && `Баталгаа ${affirmationIndex + 1}/5`}
                  {currentPhase === 'silence' && 'Нам гүм'}
                  {currentPhase === 'outro' && 'Дуусгавар'}
                </h3>
                
                <div className="text-7xl font-bold my-4">{countdown}</div>
                
                {currentPhase === 'breathing' && (
                  <p className="text-sm opacity-90">{exercise.breathing}</p>
                )}
                
                {currentPhase === 'affirmation' && (
                  <div className="bg-white/20 backdrop-blur p-4 rounded-xl">
                    <p className="text-base mb-1">{exercise.affirmation_mn}</p>
                    <p className="text-xs opacity-80 italic">{exercise.affirmation_en}</p>
                  </div>
                )}
                
                {currentPhase === 'silence' && (
                  <p className="text-sm opacity-90">{exercise.visualization}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={pauseExercise}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Pause size={20} />
                  Зогсоох
                </button>
                
                <button
                  onClick={skipToNext}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <SkipForward size={20} />
                  Дараах
                </button>
              </div>

              <div className="text-center text-xs text-white bg-black/20 rounded-lg p-2">
                🎵 {exercise.hz} Hz тоглож байна
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-600 space-y-1">
          <p>💡 Чихэвч ашиглах нь илүү үр дүнтэй</p>
          <p>🎧 Дуу чимээгүй газарт суугаарай</p>
        </div>
      </div>
    </div>
  );
}