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
}

export interface MoodCategory {
  id: number;
  name: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export interface Mood {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  intensity_level?: number;
  emoji?: string;
  created_at: string;
}

export interface MoodEntry {
  id: number;
  user_id: number;
  entry_date: string;
  mood_id: number;
  intensity?: number;
  when_felt?: 'morning' | 'afternoon' | 'evening' | 'night';
  trigger_event?: string;
  coping_strategy?: string;
  notes?: string;
  location?: string;
  weather?: string;
  created_at: string;
}

// ////////////////////////////////////////////////////////////////
// CORE VALUES & GOALS
// ////////////////////////////////////////////////////////////////

export interface CoreValue {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  priority_order?: number;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface Lesson {
  id: number;
  category_id: number;
  parent_id?: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
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
