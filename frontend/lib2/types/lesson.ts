export interface LessonCategory {
  id: number;
  parent_id?: number;
  sort_order?: number;
  created_at: string;
  name_mn: string;
  name_en: string;
  description?: string;
  icon?: string;
  color?: string;
  emoji?: string;
  children?: LessonCategory[];
}

export interface Lesson {
  id: number;
  category_id: number;
  parent_id?: number;
  title: string;
  slug: string;
  description?: string;
  content: string;
  lesson_type: 'article' | 'meditation' | 'video' | 'audio' | 'interactive';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  required_level: number;
  estimated_duration?: number;
  points_reward: number;
  media_url?: string;
  thumbnail_url?: string;
  tags?: string;
  is_premium: boolean;
  is_published: boolean;
  view_count: number;
  sort_order?: number;
   sort_id?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface MeditationSession {
  id: number;
  user_id: number;
  technique_id?: number;
  session_date: string;
  start_time?: string;
  duration_planned?: number;
  duration_actual?: number;
  quality_rating?: number;
  mood_before?: string;
  mood_after?: string;
  notes?: string;
  interruptions?: number;
  environment?: string;
  created_at: string;
}

export interface CompleteLessonPayload {
  lesson_id: number;
  points_reward: number;
  time_spent: number; // секундээр
  rating?: number;    // 1-5 одоор
  comment?: string;   // Сэтгэгдэл
}