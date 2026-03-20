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