CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  total_score INT DEFAULT 0,
  current_level INT DEFAULT 1,
  level_progress INT DEFAULT 0,
  profile_picture VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_levels (
  id SERIAL PRIMARY KEY,
  level_number INT UNIQUE NOT NULL,
  level_name VARCHAR(100) NOT NULL,
  min_score INT NOT NULL,
  max_score INT NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  badge_image VARCHAR(255),
  perks TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  achievement_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  badge_icon VARCHAR(50),
  points_earned INT DEFAULT 0,
  unlocked_at TIMESTAMP DEFAULT now(),
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_streaks (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  streak_type VARCHAR(50) NOT NULL,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, streak_type)
);

CREATE TABLE journals (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  title VARCHAR(255),
  entry_date DATE NOT NULL,
  content TEXT NOT NULL,
  word_count INT,
  sentiment_score DECIMAL(3,2),
  is_private BOOLEAN DEFAULT TRUE,
  tags TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE mood_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE moods (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES mood_categories(id),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  intensity_level INT,
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE mood_entries (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  entry_date DATE NOT NULL,
  mood_id INT NOT NULL REFERENCES moods(id),
  intensity INT,
  when_felt VARCHAR(20),
  trigger_event TEXT,
  coping_strategy TEXT,
  notes TEXT,
  location VARCHAR(100),
  weather VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, entry_date),
  INDEX (entry_date)
);

CREATE TABLE core_values (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  priority_order INT,
  color VARCHAR(7),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  value_id INT REFERENCES core_values(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal_type VARCHAR(20),
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  progress_percentage INT DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP
);

CREATE TABLE goal_milestones (
  id SERIAL PRIMARY KEY,
  goal_id INT NOT NULL REFERENCES goals(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE lesson_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  sort_order INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES lesson_categories(id),
  parent_id INT REFERENCES lessons(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  content TEXT,
  lesson_type VARCHAR(20),
  difficulty_level VARCHAR(20),
  required_level INT DEFAULT 1,
  estimated_duration INT,
  points_reward INT DEFAULT 0,
  media_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  tags TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  sort_order INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  published_at TIMESTAMP
);

CREATE TABLE lesson_comments (
  id SERIAL PRIMARY KEY,
  lesson_id INT NOT NULL REFERENCES lessons(id),
  user_id INT NOT NULL REFERENCES users(id),
  parent_id INT REFERENCES lesson_comments(id),
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE lesson_reactions (
  id SERIAL PRIMARY KEY,
  lesson_id INT NOT NULL REFERENCES lessons(id),
  user_id INT NOT NULL REFERENCES users(id),
  reaction_type VARCHAR(20),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (lesson_id, user_id, reaction_type)
);

CREATE TABLE user_lesson_progress (
  id SERIAL PRIMARY KEY,
  lesson_id INT NOT NULL REFERENCES lessons(id),
  user_id INT NOT NULL REFERENCES users(id),
  progress_percentage INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'not_started',
  time_spent INT DEFAULT 0,
  last_accessed TIMESTAMP,
  completion_date TIMESTAMP,
  rating INT,
  review_text TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

CREATE TABLE meditation_techniques (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  instructions TEXT,
  difficulty_level VARCHAR(20),
  recommended_duration INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE meditation_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  technique_id INT REFERENCES meditation_techniques(id),
  session_date DATE NOT NULL,
  start_time TIMESTAMP,
  duration_planned INT,
  duration_actual INT,
  quality_rating INT,
  mood_before VARCHAR(50),
  mood_after VARCHAR(50),
  notes TEXT,
  interruptions INT DEFAULT 0,
  environment VARCHAR(100),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, session_date)
);

CREATE TABLE ai_scoring_criteria (
  id SERIAL PRIMARY KEY,
  criteria_name VARCHAR(100) NOT NULL,
  description TEXT,
  max_points INT DEFAULT 10,
  weight DECIMAL(3,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE ai_journal_detailed_analysis (
  id SERIAL PRIMARY KEY,
  journal_id INT NOT NULL REFERENCES journals(id),
  user_id INT NOT NULL REFERENCES users(id),
  overall_sentiment DECIMAL(3,2),
  primary_emotions TEXT,
  emotion_intensity DECIMAL(3,2),
  emotional_depth_score INT,
  self_reflection_score INT,
  goal_alignment_score INT,
  gratitude_score INT,
  problem_solving_score INT,
  mindfulness_score INT,
  stress_indicators TEXT,
  positive_patterns TEXT,
  concerning_patterns TEXT,
  growth_indicators TEXT,
  personalized_feedback TEXT,
  suggested_actions TEXT,
  recommended_lessons TEXT,
  total_weighted_score DECIMAL(5,2),
  bonus_points INT DEFAULT 0,
  final_points INT,
  ai_confidence DECIMAL(3,2),
  processing_version VARCHAR(10) DEFAULT 'v1.0',
  processing_duration INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE ai_mood_analysis (
  id SERIAL PRIMARY KEY,
  mood_entry_id INT NOT NULL REFERENCES mood_entries(id),
  user_id INT NOT NULL REFERENCES users(id),
  mood_consistency_score INT,
  trigger_pattern_score INT,
  coping_effectiveness_score INT,
  emotional_intelligence_score INT,
  detected_patterns TEXT,
  improvement_suggestions TEXT,
  warning_flags TEXT,
  points_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE ai_progress_tracking (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  analysis_period VARCHAR(20),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  journal_consistency_score INT,
  mood_stability_trend DECIMAL(3,2),
  goal_progress_rate DECIMAL(5,2),
  meditation_regularity_score INT,
  overall_wellbeing_trend DECIMAL(3,2),
  key_improvements TEXT,
  areas_needing_attention TEXT,
  behavioral_changes_detected TEXT,
  recommended_focus_areas TEXT,
  period_total_points INT,
  improvement_bonus_points INT DEFAULT 0,
  consistency_bonus_points INT DEFAULT 0,
  generated_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, analysis_period, period_start)
);

CREATE TABLE scoring_history (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  source_type VARCHAR(20) NOT NULL,
  source_id INT,
  points_earned INT NOT NULL,
  points_type VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_insights (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  insight_type VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  data_points TEXT,
  period_start DATE,
  period_end DATE,
  is_read BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE progress_reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  report_type VARCHAR(20),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  overall_wellbeing_score INT,
  mood_summary TEXT,
  journal_insights TEXT,
  goal_progress TEXT,
  meditation_summary TEXT,
  key_achievements TEXT,
  areas_for_improvement TEXT,
  personalized_recommendations TEXT,
  generated_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, report_type, period_start)
);

CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  reminder_journal BOOLEAN DEFAULT TRUE,
  reminder_mood_check BOOLEAN DEFAULT TRUE,
  reminder_meditation BOOLEAN DEFAULT TRUE,
  reminder_time VARCHAR(5) DEFAULT '20:00',
  notification_email BOOLEAN DEFAULT TRUE,
  notification_push BOOLEAN DEFAULT TRUE,
  privacy_level VARCHAR(20) DEFAULT 'private',
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  notification_type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);




// add system logic
CREATE TABLE auth_otp (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id BIGINT NOT NULL,
    otp VARCHAR(255) NOT NULL,
    expired_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Roles table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    level SMALLINT,
    code VARCHAR(2),
    name VARCHAR(30),
    permissions JSONB,
    created_by_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_by_id BIGINT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_roles_created_by FOREIGN KEY(created_by_id) REFERENCES users(id),
    CONSTRAINT fk_roles_updated_by FOREIGN KEY(updated_by_id) REFERENCES users(id)
);

-- RoleOwners table
CREATE TABLE role_owners (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by_id BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    status VARCHAR(10)
);

