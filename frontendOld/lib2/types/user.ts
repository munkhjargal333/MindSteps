export interface User {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
  timezone: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  gamification: UserGamification
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

export interface UserGamification {
	ID :            number        
	user_id:          number       
	current_level_id: number        
	total_score:     number         
	level_progress:  number         
	current_streak:  number        
	longest_streak:  number         
	last_activity_at: string   
	updated_at:      string   
	// UserData:       User   
	level:          UserLevel
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

export interface DashboardStats {
  stats: {
    total_journals: number;
    total_moods: number;
    total_lessons_completed: number;
  };
  
  category_progress: Array<{
    category_id: number;
    category_name: string;
    emoji: string;
    total_lessons: number;
    completed_lessons: number;
    progress_percent: number;
  }>;
  plutchik_wheel: Array<{
    emotion_id: number;
    emotion_name_mn: string;
    color: string;
    emoji: string;
    count: number;
    avg_intensity: number;
  }>;
}