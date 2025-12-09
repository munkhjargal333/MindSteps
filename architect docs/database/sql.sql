-- ============================================================================
-- SELF-DISCOVERY & PERSONAL DEVELOPMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- Version: 2.0
-- Description: Improved schema with GDPR compliance, AI tracking, and performance optimizations
-- ============================================================================


-- ============================================================================
-- PLUTCHIK'S EMOTION WHEEL
-- ============================================================================

-- Plutchik's 8 basic emotions
CREATE TABLE plutchik_emotions (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(50) NOT NULL,
  name_mn VARCHAR(50) NOT NULL,
  opposite_emotion_id INT REFERENCES plutchik_emotions(id),
  intensity_level INT NOT NULL, -- 1=mild, 2=basic, 3=intense
  base_emotion_id INT REFERENCES plutchik_emotions(id), -- Reference to basic level
  color VARCHAR(7),
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT now()
);

-- Insert Plutchik emotions
INSERT INTO plutchik_emotions (name_en, name_mn, intensity_level, color, emoji) VALUES
-- Joy family
('Serenity', 'Тайван байдал', 1, '#FFFACD', '😌'),
('Joy', 'Баяр', 2, '#FFD700', '😊'),
('Ecstasy', 'Хөөрөл', 3, '#FF8C00', '😄'),
-- Trust family
('Acceptance', 'Хүлээн авалт', 1, '#90EE90', '🙂'),
('Trust', 'Итгэл', 2, '#32CD32', '😌'),
('Admiration', 'Биширэл', 3, '#228B22', '🤩'),
-- Fear family
('Apprehension', 'Түгшүүр', 1, '#B0E0E6', '😰'),
('Fear', 'Айдас', 2, '#4682B4', '😨'),
('Terror', 'Аймшиг', 3, '#00008B', '😱'),
-- Surprise family
('Distraction', 'Сатаашрал', 1, '#FFE4B5', '😮'),
('Surprise', 'Гайхшрал', 2, '#FFA500', '😲'),
('Amazement', 'Гайхамшиг', 3, '#FF4500', '🤯'),
-- Sadness family
('Pensiveness', 'Бодол', 1, '#D3D3D3', '😔'),
('Sadness', 'Гуниг', 2, '#808080', '😢'),
('Grief', 'Уйтгар', 3, '#2F4F4F', '😭'),
-- Disgust family
('Boredom', 'Уйтгар', 1, '#DDA0DD', '😒'),
('Disgust', 'Жигшил', 2, '#9370DB', '🤢'),
('Loathing', 'Зэвүүцэл', 3, '#4B0082', '🤮'),
-- Anger family
('Annoyance', 'Бухимдал', 1, '#FFB6C1', '😠'),
('Anger', 'Уур хилэн', 2, '#FF69B4', '😡'),
('Rage', 'Ууртай байдал', 3, '#DC143C', '🤬'),
-- Anticipation family
('Interest', 'Сонирхол', 1, '#F0E68C', '🤔'),
('Anticipation', 'Хүлээлт', 2, '#DAA520', '😃'),
('Vigilance', 'Сэрэмжлэл', 3, '#B8860B', '🧐');

-- Plutchik emotion combinations (dyads)
CREATE TABLE plutchik_combinations (
  id SERIAL PRIMARY KEY,
  emotion1_id INT NOT NULL REFERENCES plutchik_emotions(id),
  emotion2_id INT NOT NULL REFERENCES plutchik_emotions(id),
  combined_name_en VARCHAR(50),
  combined_name_mn VARCHAR(50),
  combination_type VARCHAR(20), -- 'primary', 'secondary', 'tertiary'
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (emotion1_id, emotion2_id)
);

-- Insert primary dyads
INSERT INTO plutchik_combinations (emotion1_id, emotion2_id, combined_name_en, combined_name_mn, combination_type) VALUES
(2, 5, 'Love', 'Хайр', 'primary'),
(2, 11, 'Optimism', 'Өөдрөг байдал', 'primary'),
(5, 8, 'Submission', 'Даатгал', 'primary'),
(8, 14, 'Awe', 'Биширэл', 'primary'),
(14, 17, 'Disapproval', 'Зөвшөөрөхгүй', 'primary'),
(17, 20, 'Remorse', 'Гэмшил', 'primary'),
(20, 23, 'Contempt', 'Тооцохгүй байдал', 'primary'),
(23, 11, 'Aggressiveness', 'Түрэмгий байдал', 'primary');

-- User emotion tracking
CREATE TABLE user_emotion_wheel (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_entry_id BIGINT,
  journal_id BIGINT,
  plutchik_emotion_id INT NOT NULL REFERENCES plutchik_emotions(id),
  intensity INT CHECK (intensity >= 1 AND intensity <= 10),
  detected_combination_id INT REFERENCES plutchik_combinations(id),
  is_ai_detected BOOLEAN DEFAULT FALSE,
  recorded_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_emotion_wheel_user ON user_emotion_wheel(user_id, recorded_at DESC);
CREATE INDEX idx_emotion_wheel_mood ON user_emotion_wheel(mood_entry_id);

-- ============================================================================
-- JOURNALS
-- ============================================================================

CREATE TABLE journals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  content_encrypted TEXT,
  encryption_key_id BIGINT REFERENCES encryption_keys(id),
  word_count INT,
  sentiment_score DECIMAL(4,2), -- -1.00 to 1.00
  is_private BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  related_value_ids BIGINT[], -- Array of core_value IDs
  ai_detected_values BIGINT[], -- AI-detected values
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_journals_user_created ON journals(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_journals_tags ON journals USING GIN(tags) WHERE deleted_at IS NULL;
CREATE INDEX idx_journals_content_search ON journals USING GIN(to_tsvector('english', content)) WHERE deleted_at IS NULL;

-- ============================================================================
-- MOOD TRACKING
-- ============================================================================

-- Mood categories (predefined)
CREATE TABLE mood_categories (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(50) NOT NULL,
  name_mn VARCHAR(50) NOT NULL,
  color VARCHAR(7),
  icon VARCHAR(50),
  sort_order INT,
  created_at TIMESTAMP DEFAULT now()
);

INSERT INTO mood_categories (name_en, name_mn, color, icon, sort_order) VALUES
('Happy', 'Баяртай', '#FFD700', 'smile', 1),
('Calm', 'Тайван', '#87CEEB', 'wind', 2),
('Energetic', 'Эрч хүчтэй', '#FF6347', 'zap', 3),
('Sad', 'Гунигтай', '#4682B4', 'frown', 4),
('Anxious', 'Түгшүүртэй', '#FF8C00', 'alert-circle', 5),
('Angry', 'Уурлаж', '#DC143C', 'alert-triangle', 6),
('Grateful', 'Талархаж', '#32CD32', 'heart', 7),
('Stressed', 'Стресстэй', '#8B0000', 'x-circle', 8);

-- Specific moods under categories
CREATE TABLE moods (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES mood_categories(id),
  name_en VARCHAR(50) NOT NULL,
  name_mn VARCHAR(50) NOT NULL,
  description TEXT,
  intensity_level INT, -- 1-3
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT now()
);

-- Mood entries from users
CREATE TABLE mood_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_id INT NOT NULL REFERENCES moods(id),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  intensity INT CHECK (intensity >= 1 AND intensity <= 10),
  when_felt VARCHAR(20), -- 'morning', 'afternoon', 'evening', 'night'
  trigger_event TEXT,
  coping_strategy TEXT,
  notes TEXT,
  location VARCHAR(100),
  weather VARCHAR(50),
  related_value_ids BIGINT[],
  ai_detected_values BIGINT[],
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, entry_date DESC);
CREATE INDEX idx_mood_entries_date ON mood_entries(entry_date);

-- ============================================================================
-- GOALS & MILESTONES
-- ============================================================================

CREATE TABLE goals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value_id BIGINT REFERENCES core_values(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal_type VARCHAR(20), -- 'short_term', 'long_term', 'habit'
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_public BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_goals_user_status ON goals(user_id, status, target_date) WHERE deleted_at IS NULL;

-- Goal milestones
CREATE TABLE goal_milestones (
  id BIGSERIAL PRIMARY KEY,
  goal_id BIGINT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  sort_order INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_milestones_goal ON goal_milestones(goal_id, sort_order);

-- ============================================================================
-- LESSONS & LEARNING
-- ============================================================================

-- Lesson categories
CREATE TABLE lesson_categories (
  id SERIAL PRIMARY KEY,
  parent_id INT REFERENCES lesson_categories(id),
  name_en VARCHAR(100) NOT NULL,
  name_mn VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  sort_order INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

-- Lessons/content
CREATE TABLE lessons (
  id BIGSERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES lesson_categories(id),
  parent_id BIGINT REFERENCES lessons(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  content TEXT,
  lesson_type VARCHAR(20), -- 'article', 'video', 'audio', 'interactive'
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  required_level INT DEFAULT 1,
  estimated_duration INT, -- in minutes
  points_reward INT DEFAULT 0,
  media_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  tags TEXT[],
  related_value_keywords TEXT[], -- For recommendation
  related_emotion_keywords TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  sort_order INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  published_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_lessons_published ON lessons(is_published, category_id, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_lessons_slug ON lessons(slug) WHERE is_published = TRUE;
CREATE INDEX idx_lessons_tags ON lessons USING GIN(tags);

-- User lesson progress
CREATE TABLE user_lesson_progress (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status VARCHAR(20) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  time_spent INT DEFAULT 0, -- in seconds
  last_accessed TIMESTAMP,
  completion_date TIMESTAMP,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_status ON user_lesson_progress(user_id, status, last_accessed DESC);

-- Lesson recommendations
CREATE TABLE lesson_recommendations (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  recommendation_reason VARCHAR(50), -- 'value_gap', 'emotion_pattern', 'level_match', 'popular'
  related_value_id BIGINT REFERENCES core_values(id),
  related_pattern_id BIGINT,
  priority_score INT DEFAULT 0,
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP,
  viewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_lesson_recommendations_user ON lesson_recommendations(user_id, priority_score DESC, created_at DESC) WHERE is_dismissed = FALSE;

-- Lesson comments
CREATE TABLE lesson_comments (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id BIGINT REFERENCES lesson_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_lesson_comments_lesson ON lesson_comments(lesson_id, created_at DESC) WHERE is_deleted = FALSE;

-- Lesson reactions
CREATE TABLE lesson_reactions (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20), -- 'like', 'love', 'helpful', 'insightful'
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (lesson_id, user_id, reaction_type)
);

CREATE INDEX idx_lesson_reactions_lesson ON lesson_reactions(lesson_id, reaction_type);

-- ============================================================================
-- MEDITATION & MINDFULNESS
-- ============================================================================

-- Meditation techniques (predefined)
CREATE TABLE meditation_techniques (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_mn VARCHAR(100) NOT NULL,
  description TEXT,
  instructions TEXT,
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  recommended_duration INT, -- in minutes
  category VARCHAR(50), -- 'breathing', 'visualization', 'body_scan', 'loving_kindness'
  benefits TEXT[],
  audio_url VARCHAR(500),
  video_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  is_guided BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

-- User meditation sessions
CREATE TABLE meditation_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  technique_id INT REFERENCES meditation_techniques(id),
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_planned INT, -- in minutes
  duration_actual INT, -- in minutes
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
  mood_before VARCHAR(50),
  mood_after VARCHAR(50),
  focus_level INT CHECK (focus_level >= 1 AND focus_level <= 10),
  notes TEXT,
  interruptions INT DEFAULT 0,
  environment VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_meditation_sessions_user_date ON meditation_sessions(user_id, session_date DESC);

-- ============================================================================
-- AI ANALYSIS & INSIGHTS
-- ============================================================================

-- AI scoring criteria configuration
CREATE TABLE ai_scoring_criteria (
  id SERIAL PRIMARY KEY,
  criteria_name VARCHAR(100) NOT NULL,
  criteria_category VARCHAR(50), -- 'journal', 'mood', 'meditation', 'goal'
  description TEXT,
  max_points INT DEFAULT 10,
  weight DECIMAL(3,2) DEFAULT 1.0,
  calculation_method TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Detailed journal AI analysis
CREATE TABLE ai_journal_detailed_analysis (
  id BIGSERIAL PRIMARY KEY,
  journal_id BIGINT NOT NULL REFERENCES journals(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Sentiment & Emotion
  overall_sentiment DECIMAL(4,2), -- -1.00 to 1.00
  primary_emotions JSONB, -- [{"emotion": "joy", "confidence": 0.85}]
  emotion_intensity DECIMAL(3,2),
  
  -- Scoring breakdown
  emotional_depth_score INT DEFAULT 0,
  self_reflection_score INT DEFAULT 0,
  goal_alignment_score INT DEFAULT 0,
  gratitude_score INT DEFAULT 0,
  problem_solving_score INT DEFAULT 0,
  mindfulness_score INT DEFAULT 0,
  
  -- Pattern detection
  stress_indicators TEXT[],
  positive_patterns TEXT[],
  concerning_patterns TEXT[],
  growth_indicators TEXT[],
  
  -- Recommendations
  personalized_feedback TEXT,
  suggested_actions TEXT[],
  recommended_lesson_ids BIGINT[],
  
  -- Points calculation
  total_weighted_score DECIMAL(5,2),
  bonus_points INT DEFAULT 0,
  final_points INT,
  
  -- Metadata
  ai_confidence DECIMAL(3,2),
  processing_version VARCHAR(10) DEFAULT 'v1.0',
  processing_duration INT, -- in milliseconds
  model_name VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_ai_journal_analysis_journal ON ai_journal_detailed_analysis(journal_id);
CREATE INDEX idx_ai_journal_analysis_user ON ai_journal_detailed_analysis(user_id, created_at DESC);

-- AI mood analysis
CREATE TABLE ai_mood_analysis (
  id BIGSERIAL PRIMARY KEY,
  mood_entry_id BIGINT NOT NULL REFERENCES mood_entries(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Scoring
  mood_consistency_score INT DEFAULT 0,
  trigger_pattern_score INT DEFAULT 0,
  coping_effectiveness_score INT DEFAULT 0,
  emotional_intelligence_score INT DEFAULT 0,
  
  -- Insights
  detected_patterns JSONB,
  trigger_analysis TEXT,
  improvement_suggestions TEXT[],
  warning_flags TEXT[],
  
  -- Points
  points_earned INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_ai_mood_analysis_mood ON ai_mood_analysis(mood_entry_id);
CREATE INDEX idx_ai_mood_analysis_user ON ai_mood_analysis(user_id, created_at DESC);

-- Weekly deep AI analysis for mood patterns
CREATE TABLE ai_weekly_mood_deep_analysis (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_week DATE NOT NULL, -- Start of week
  
  -- Deep pattern detection
  hidden_emotional_patterns JSONB,
  unconscious_triggers JSONB,
  emotional_cycles TEXT[],
  unmet_needs TEXT[],
  
  -- Core values connection
  values_in_conflict JSONB,
  values_being_honored JSONB,
  
  -- Recommendations
  deep_insights TEXT,
  recommended_actions TEXT[],
  suggested_lesson_ids BIGINT[],
  consciousness_shift_opportunities TEXT[],
  
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, analysis_week)
);

CREATE INDEX idx_weekly_mood_analysis_user ON ai_weekly_mood_deep_analysis(user_id, analysis_week DESC);

-- AI progress tracking (weekly/monthly reports)
CREATE TABLE ai_progress_tracking (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_period VARCHAR(20), -- 'weekly', 'monthly', 'quarterly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metrics
  journal_consistency_score INT,
  mood_stability_trend DECIMAL(4,2),
  goal_progress_rate DECIMAL(5,2),
  meditation_regularity_score INT,
  overall_wellbeing_trend DECIMAL(4,2),
  consciousness_level_change INT,
  
  -- Insights
  key_improvements JSONB,
  areas_needing_attention JSONB,
  behavioral_changes_detected JSONB,
  recommended_focus_areas TEXT[],
  
  -- Gamification
  period_total_points INT,
  improvement_bonus_points INT DEFAULT 0,
  consistency_bonus_points INT DEFAULT 0,
  
  generated_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, analysis_period, period_start)
);

CREATE INDEX idx_progress_tracking_user ON ai_progress_tracking(user_id, period_start DESC);

-- Pattern detection system
CREATE TABLE detected_patterns (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pattern_type VARCHAR(50) NOT NULL, -- 'emotional', 'behavioral', 'value_conflict', 'trigger'
  pattern_category VARCHAR(30), -- 'positive', 'neutral', 'concerning'
  pattern_name VARCHAR(255),
  description TEXT,
  
  -- Pattern details
  detected_from TEXT[], -- ['journals', 'moods', 'goals']
  frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'sporadic'
  confidence_score DECIMAL(3,2),
  
  -- Timeline
  first_detected DATE,
  last_detected DATE,
  occurrence_count INT DEFAULT 1,
  
  -- Impact assessment
  severity VARCHAR(20), -- 'info', 'low', 'medium', 'high', 'critical'
  related_value_ids BIGINT[],
  emotional_impact_score INT,
  
  -- Recommendations
  suggested_actions TEXT[],
  recommended_lesson_ids BIGINT[],
  
  -- Status
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  user_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_patterns_user_type ON detected_patterns(user_id, pattern_type, is_resolved);
CREATE INDEX idx_patterns_severity ON detected_patterns(user_id, severity, created_at DESC) WHERE is_resolved = FALSE;

-- ============================================================================
-- REPORTS & INSIGHTS
-- ============================================================================

-- User insights (AI-generated personalized insights)
CREATE TABLE user_insights (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_type VARCHAR(50), -- 'achievement', 'warning', 'suggestion', 'pattern', 'milestone'
  insight_category VARCHAR(30), -- 'emotional', 'behavioral', 'goal', 'value'
  title VARCHAR(255),
  description TEXT,
  data_points JSONB, -- Supporting data
  
  -- Timeline
  period_start DATE,
  period_end DATE,
  
  -- Interaction
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP,
  
  -- Priority
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_insights_user_unread ON user_insights(user_id, is_read, priority, created_at DESC);

-- Progress reports (PDF-ready reports)
CREATE TABLE progress_reports (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(20), -- 'weekly', 'monthly', 'quarterly', 'custom'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Report data
  overall_wellbeing_score INT,
  mood_summary JSONB,
  journal_insights JSONB,
  goal_progress JSONB,
  meditation_summary JSONB,
  consciousness_progression JSONB,
  
  -- Highlights
  key_achievements TEXT[],
  areas_for_improvement TEXT[],
  personalized_recommendations TEXT[],
  
  -- Charts data
  chart_data JSONB,
  
  -- Export
  pdf_url VARCHAR(500),
  is_exported BOOLEAN DEFAULT FALSE,
  exported_at TIMESTAMP,
  
  generated_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, report_type, period_start)
);

CREATE INDEX idx_reports_user ON progress_reports(user_id, period_start DESC);

-- ============================================================================
-- NOTIFICATIONS & REMINDERS
-- ============================================================================

-- User preferences
CREATE TABLE user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Reminders
  reminder_journal BOOLEAN DEFAULT TRUE,
  reminder_mood_check BOOLEAN DEFAULT TRUE,
  reminder_meditation BOOLEAN DEFAULT TRUE,
  reminder_goal_review BOOLEAN DEFAULT TRUE,
  reminder_time VARCHAR(5) DEFAULT '20:00',
  
  -- Notifications
  notification_email BOOLEAN DEFAULT TRUE,
  notification_push BOOLEAN DEFAULT TRUE,
  notification_insights BOOLEAN DEFAULT TRUE,
  notification_achievements BOOLEAN DEFAULT TRUE,
  
  -- Privacy
  privacy_level VARCHAR(20) DEFAULT 'private', -- 'private', 'friends', 'public'
  data_sharing BOOLEAN DEFAULT FALSE,
  
  -- Display
  theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark', 'auto'
  language VARCHAR(5) DEFAULT 'mn',
  date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
  
  -- AI preferences
  ai_analysis_frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
  ai_suggestion_level VARCHAR(20) DEFAULT 'moderate', -- 'minimal', 'moderate', 'detailed'
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id)
);

-- Notifications
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50), -- 'reminder', 'achievement', 'insight', 'system', 'social'
  title VARCHAR(255) NOT NULL,
  message TEXT,
  
  -- Action
  action_url VARCHAR(500),
  action_label VARCHAR(50),
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Scheduling
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB,
  priority VARCHAR(20) DEFAULT 'normal',
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for) WHERE sent_at IS NULL;

-- ============================================================================
-- DATA COMPLIANCE & PRIVACY (GDPR)
-- ============================================================================

-- Data retention policies
CREATE TABLE data_retention_policies (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL UNIQUE,
  retention_days INT NOT NULL, -- -1 means indefinite
  archive_after_days INT,
  auto_delete BOOLEAN DEFAULT FALSE,
  deletion_method VARCHAR(50), -- 'hard_delete', 'soft_delete', 'anonymize'
  last_cleanup_at TIMESTAMP,
  next_cleanup_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Insert retention policies
INSERT INTO data_retention_policies (table_name, retention_days, archive_after_days, auto_delete, deletion_method) VALUES
('ai_journal_detailed_analysis', 730, 365, FALSE, 'soft_delete'),
('ai_mood_analysis', 730, 365, FALSE, 'soft_delete'),
('ai_progress_tracking', 1095, 730, FALSE, 'soft_delete'),
('ai_weekly_mood_deep_analysis', 730, 365, FALSE, 'soft_delete'),
('journals', -1, NULL, FALSE, 'soft_delete'),
('mood_entries', -1, NULL, FALSE, 'soft_delete'),
('notifications', 90, NULL, TRUE, 'hard_delete'),
('user_sessions', 90, NULL, TRUE, 'hard_delete'),
('revoked_tokens', 30, NULL, TRUE, 'hard_delete'),
('auth_otp', 7, NULL, TRUE, 'hard_delete'),
('detected_patterns', 365, 180, FALSE, 'soft_delete'),
('user_insights', 180, 90, FALSE, 'hard_delete');

-- User data requests (GDPR right to access, delete, export)
CREATE TABLE user_data_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  request_type VARCHAR(50) NOT NULL, -- 'export', 'delete', 'anonymize', 'access'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  -- Request details
  requested_tables TEXT[],
  date_range_start DATE,
  date_range_end DATE,
  
  -- Processing
  requested_at TIMESTAMP DEFAULT now(),
  processing_started_at TIMESTAMP,
  processed_at TIMESTAMP,
  processed_by_id BIGINT REFERENCES users(id),
  
  -- Export specific
  export_format VARCHAR(20), -- 'json', 'csv', 'pdf'
  export_file_url VARCHAR(500),
  export_expires_at TIMESTAMP,
  
  -- Deletion specific
  deletion_reason TEXT,
  backup_created BOOLEAN DEFAULT FALSE,
  backup_location VARCHAR(500),
  
  -- Metadata
  notes TEXT,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_data_requests_user ON user_data_requests(user_id, status, created_at DESC);

-- User data access log (audit trail)
CREATE TABLE user_data_access_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  accessed_by_id BIGINT NOT NULL REFERENCES users(id),
  access_type VARCHAR(50), -- 'view', 'edit', 'delete', 'export', 'admin_view'
  table_name VARCHAR(100),
  record_id BIGINT,
  
  -- Context
  access_reason VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  session_id BIGINT REFERENCES user_sessions(id),
  
  accessed_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_access_log_user ON user_data_access_log(user_id, accessed_at DESC);
CREATE INDEX idx_access_log_accessor ON user_data_access_log(accessed_by_id, accessed_at DESC);

-- Deleted data log
CREATE TABLE deleted_data_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  table_name VARCHAR(100),
  record_id BIGINT,
  record_data JSONB, -- Backup of deleted data
  
  -- Deletion details
  deleted_reason VARCHAR(50), -- 'retention_policy', 'user_request', 'gdpr', 'admin_action'
  deletion_method VARCHAR(50), -- 'hard_delete', 'soft_delete', 'anonymize'
  
  deleted_at TIMESTAMP DEFAULT now(),
  deleted_by_id BIGINT REFERENCES users(id),
  
  -- Recovery
  can_recover BOOLEAN DEFAULT FALSE,
  recovery_expires_at TIMESTAMP
);

CREATE INDEX idx_deleted_log_user ON deleted_data_log(user_id, deleted_at DESC);

-- ============================================================================
-- SYSTEM ADMINISTRATION
-- ============================================================================

-- System settings/configuration
CREATE TABLE system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20), -- 'string', 'number', 'boolean', 'json'
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  is_editable BOOLEAN DEFAULT TRUE,
  updated_by_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- System audit log
CREATE TABLE system_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  action_type VARCHAR(50), -- 'login', 'logout', 'data_export', 'settings_change', etc.
  entity_type VARCHAR(50),
  entity_id BIGINT,
  
  -- Change details
  old_value JSONB,
  new_value JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_audit_log_user ON system_audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON system_audit_log(action_type, created_at DESC);

-- Error logs
CREATE TABLE error_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  error_type VARCHAR(50),
  error_message TEXT,
  stack_trace TEXT,
  request_url TEXT,
  request_method VARCHAR(10),
  request_body TEXT,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Status
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by_id BIGINT REFERENCES users(id),
  resolution_notes TEXT,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_error_logs_unresolved ON error_logs(is_resolved, created_at DESC);


-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'Core user accounts with authentication and gamification data';
COMMENT ON TABLE core_values IS 'User-defined core values based on Maslow''s hierarchy';
COMMENT ON TABLE consciousness_levels IS 'David Hawkins consciousness scale (1-1000)';
COMMENT ON TABLE plutchik_emotions IS 'Plutchik''s 8 basic emotions with intensity levels';
COMMENT ON TABLE detected_patterns IS 'AI-detected behavioral and emotional patterns';
COMMENT ON TABLE data_retention_policies IS 'GDPR-compliant data retention rules';
COMMENT ON TABLE user_data_requests IS 'GDPR rights: access, export, delete requests';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================