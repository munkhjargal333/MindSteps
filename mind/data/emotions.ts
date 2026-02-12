// ===== EMOTION DATA: 8 үндсэн сэтгэл хөдлөл (DB нийцтэй) =====
export type Emotion = 'joy' | 'trust' | 'fear' | 'surprise' | 'sadness' | 'anger' | 'disgust' | 'anticipation';
// ===== EMOTION MAPPING (Lower/Upper band) =====
export const EMOTION_BANDS = {
  lower: ['fear', 'anger', 'pressure', 'sadness'] as const,  // 🔻 Ego/survival
  upper: ['desire', 'peace', 'gratitude'] as const,          // 🔺 Observer/expansion
};


export interface EmotionData {
  id: Emotion;
  label: string;      
  fullName: string;  
  english: string;    
  emoji: string;      
  band: 'lower' | 'upper'; 
  description: string;
}

export const EMOTIONS: EmotionData[] = [
  {
    id: 'joy',
    label: 'Баяр',
    fullName: 'Баяр баясгалан',
    english: 'Joy',
    emoji: '😊',
    band: 'upper',
    description: 'Эерэг сэтгэл хөдлөл',
  },
  {
    id: 'trust',
    label: 'Итгэл',
    fullName: 'Итгэл найдвар',
    english: 'Trust',
    emoji: '🤝',
    band: 'upper',
    description: 'Нийгмийн холбоо',
  },
  {
    id: 'fear',
    label: 'Айдас',
    fullName: 'Айдас',
    english: 'Fear',
    emoji: '😨',
    band: 'lower',
    description: 'Хамгаалалтын сэтгэл хөдлөл',
  },
  {
    id: 'surprise',
    label: 'Гайхшрал',
    fullName: 'Гайхшрал',
    english: 'Surprise',
    emoji: '😮',
    band: 'upper',
    description: 'Шинэ зүйлд хандах хариу үйлдэл',
  },
  {
    id: 'sadness',
    label: 'Гуниг',
    fullName: 'Гуниг',
    english: 'Sadness',
    emoji: '😢',
    band: 'lower',
    description: 'Алдагдлын сэтгэл хөдлөл',
  },
  {
    id: 'anger',
    label: 'Уур',
    fullName: 'Уур хилэн',
    english: 'Anger',
    emoji: '😠',
    band: 'lower',
    description: 'Саад тотгорт хандах хариу үйлдэл',
  },
  {
    id: 'disgust',
    label: 'Жигшил',
    fullName: 'Жигшил',
    english: 'Disgust',
    emoji: '🤢',
    band: 'lower',
    description: 'Тэвчихгүй байдлын сэтгэл хөдлөл',
  },
  {
    id: 'anticipation',
    label: 'Хүлээлт',
    fullName: 'Хүлээлт',
    english: 'Anticipation',
    emoji: '👀',
    band: 'upper',
    description: 'Ирээдүйд чиглэсэн сэтгэл хөдлөл',
  },
];