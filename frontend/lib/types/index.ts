// ////////////////////////////////////////////////////////////////
// USERS & LEVEL SYSTEM
// ////////////////////////////////////////////////////////////////

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  total_score: number;
  current_level: number;
  level_progress: number;
  profile_picture?: string;
  timezone: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserLevel {
  id: number;
  level_number: number;
  level_name: string;
  min_score: number;
  max_score: number;
  description?: string;
  icon?: string;
  color?: string;
  badge_image?: string;
  perks?: string; // JSON format
  created_at: string;
}

export interface UserStreak {
  id: number;
  user_id: number;
  streak_type: 'journal' | 'mood' | 'meditation' | 'lesson';
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  created_at: string;
  updated_at: string;
}

// ////////////////////////////////////////////////////////////////
// JOURNAL & MOOD
// ////////////////////////////////////////////////////////////////

export interface Journal {
  id: number;
  user_id: number;
  title: string;
  entry_date: string;
  content: string;
  word_count?: number;
  sentiment_score?: number;
  is_private: boolean;
  tags?: string;
  created_at: string;
  updated_at: string;
  related_value_ids?: number;
}

export interface MoodCategory {
  id: number;
  name_mn: string;
  color?: string;
  emoji?: string;
  created_at: string;
}

export interface PlutchikEmotion {
  id: number;
  category_id: number;
  name_mn: string;
  name_en: string;
  //description?: string;
  intensity_level: number;
  emoji: string;
  color: string;
  created_at: string;
}

export interface PlutchikCombination {
  id: number;
  emotion1_id: number;
  emotion2_id: number;
  combined_name_en: string;
  combined_name_mn: string;
  combined_type: 'primary' | 'secondary' | 'tertiary';
  description?: string;
  emoji?: string;
  color?: string;
  Emotion1? : PlutchikEmotion
  Emotion2? : PlutchikEmotion
}

export interface MoodUnit{
  id: number;
  category_id: number;
  plutchik_id?: number;
  combination_id?: number;
  type: 'primary' | 'dyad';
  description?: string;
  display_name_mn: string;
  display_name_en: string;
  display_color: string;
  display_emoji: string;

  MoodCategories?: MoodCategory;
  PlutchikEmotions?: PlutchikEmotion;
  PlutchikCombinations?: PlutchikCombination;
}

export interface MoodEntry {
  id: number;
  user_id: number;
  mood_unit_id: number;
  entry_date: string;
  intensity: number;
  when_felt?: string;
  trigger_event?: string;
  coping_strategy?: string;
  notes?: string;
  location?: string;
  weather?: string;
  created_at: string;
  core_value_id: number;
  CoreValues?:  CoreValue;
  MoodUnit: MoodUnit;
}

// ////////////////////////////////////////////////////////////////
// CORE VALUES & GOALS
// ////////////////////////////////////////////////////////////////

export interface Maslow {
  id: number;
  level_number: number;
  name: string;
  description?: string;
  sort_order?: number;
  color?: string;
  icon: string;
}

export interface CoreValue {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  priority_order?: number;
  maslow_level_id?: number
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  MaslowLevel?: Maslow;
}

export interface Goal {
  id: number;
  user_id: number;
  value_id?: number;
  title: string;
  description?: string;
  goal_type: 'short_term' | 'long_term' | 'daily' | 'weekly' | 'monthly';
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress_percentage: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  GoalMilestones? : Milestone[];
}

export interface Milestone {
  id: number;
  goal_id: number;
  title: string;
  description?: string;
  target_date?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

// ////////////////////////////////////////////////////////////////
// LESSONS & CONTENT
// ////////////////////////////////////////////////////////////////

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
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CompleteLessonPayload {
  lesson_id: number;
  points_reward: number;
  time_spent: number; // секундээр
  rating?: number;    // 1-5 одоор
  comment?: string;   // Сэтгэгдэл
}

// ////////////////////////////////////////////////////////////////
// MEDITATION & PRACTICE
// ////////////////////////////////////////////////////////////////

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
