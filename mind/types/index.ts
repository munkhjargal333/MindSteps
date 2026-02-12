import { Emotion } from '@/data/emotions';

// ===== TYPES: Системийн бүх төрлүүд =====

export type QuickActionType = 'thought' | 'emotion';

export type TimeFocus = 'past' | 'now' | 'future' | 'neutral';


// Тэмдэглэл (Thought) session
export interface ThoughtSession {
  id: string;
  createdAt: Date;
  
  feeling: string;       // "Одоо юу мэдэрч байна?"
  thinking: string;      // "Юу бодогдож байна?"
  
  isFamiliar: boolean;   // "Энэ бодол танил уу?"
  timeFocus: TimeFocus;
  relatedToSelf: boolean; // "Энэ бодол 'би'-тэй холбоотой юу?"

  insight?: string;
}

// Сэтгэл хөдөл (Emotion) session
export interface EmotionSession {
  id: string;
  createdAt: Date;
  
  emotion: Emotion;
  
  knowTrigger?: boolean;   // "Юу өдөөсөн мэдэх үү?"
  knowPurpose?: boolean;   // "Юунд зориулагдсанг мэдэх үү?"
  fromPast?: boolean;      // "Өнгөрсөн үйл явдалаас болсон юм биш биз?"
  insight?: string;
}

