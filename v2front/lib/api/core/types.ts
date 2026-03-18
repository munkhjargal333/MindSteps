import {
  Journal,
  User,
  UserGamification,
  UserStreak,
  MoodCategory,
  MoodUnit,
  PlutchikEmotion,
  MoodEntry,
  Goal,
  Lesson,
  MeditationSession,
  UserLevel,
  CoreValue,
  Milestone,
  Maslow,
  LessonCategory,
  PlutchikCombination,
  CompleteLessonPayload,
  DashboardStats
} from '@/lib/types';

// ==================== GENERIC RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ==================== JOURNAL TYPES ====================

export interface JournalListResponse {
  journals: Journal[];
  total: number;
  page: number;
  limit: number;
}

export interface JournalSearchParams {
  query?: string;
  tags?: string;
  from_date?: string;
  to_date?: string;
}

export interface JournalSearchResponse {
  journals: Journal[];
  total: number;
}

// ==================== MOOD TYPES ====================

export interface MoodEntryListResponse {
  entries: MoodEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface MoodStatistics {
  total_entries: number;
  period_days: number;
  average_intensity?: number;
  mood_distribution?: Record<number, number>;
}

// ==================== GOAL TYPES ====================

export interface GoalListResponse {
  success: boolean;
  summary: {
    total: number;
    active: number;
    completed: number;
    paused: number;
  };
  goals: {
    active: Goal[];
    completed: Goal[];
    paused: Goal[];
  };
}

export interface GoalStatistics {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  paused_goals: number;
  total_milestones: number;
  completed_milestones: number;
  average_progress: number;
  goals_by_type: {
    short_term: number;
    long_term: number;
    habit: number;
  };
  goals_by_priority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface MilestoneCompleteResponse {
  success: boolean;
  milestone: Milestone;
  goal_progress: {
    percentage: number;
    status: string;
    is_complete: boolean;
  };
}

// ==================== CORE VALUE TYPES ====================

export interface CoreValueListResponse {
  core_values: CoreValue[];
  total: number;
}

// ==================== LESSON TYPES ====================

export interface LessonListResponse {
  lessons: Lesson[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoriesList {
  lessons: LessonCategory[];
  total: number;
}

export interface CreateLessonData {
  title: string;
  slug?: string;
  category_id: number;
  description?: string;
  content: string;
  lesson_type: string;
  difficulty_level: string;
  required_level?: number;
  estimated_duration?: number;
  points_reward?: number;
  media_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  related_value_keywords?: string;
  related_emotion_keywords?: string;
  is_premium?: boolean;
  is_published?: boolean;
  sort_order?: number;
}

export interface UpdateLessonData extends Partial<CreateLessonData> {}

// ==================== ADMIN TYPES ====================

export interface MoodUnitListResponse {
  mood_units: MoodUnit[];
  total: number;
  page: number;
  limit: number;
}

export interface PlutchikCombinationListResponse {
  combinations: PlutchikCombination[];
  total: number;
}