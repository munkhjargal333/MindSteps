////////////////////////////////////////////////// 
// USERS & LEVEL SYSTEM
//////////////////////////////////////////////////
Table users {
  id uint [pk, increment]
  name varchar(100) [not null]
  email varchar(255) [unique, not null]
  password varchar(255) [not null] // хэрэгтэй бол hashed
  total_score uint [default: 0] // нийт оноо
  current_level uint [default: 1] // одоогийн түвшин
  level_progress uint [default: 0] // тухайн түвшинд хэр дууссан (%)
  profile_picture varchar(255) // profile зураг
  timezone varchar(50) [default: 'UTC'] // хэрэглэгчийн цагийн бүс
  is_active boolean [default: true]
  last_login timestamp
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

////////////////////////////////////////////////// 
// USER LEVEL SYSTEM 
//////////////////////////////////////////////////
Table user_levels {
  id uint [pk, increment]
  level_number int [unique, not null]
  level_name varchar(100) [not null] // "Beginner Explorer", "Mindful Wanderer", etc.
  min_score uint [not null] // энэ түвшинд шаардагдах хамгийн бага оноо
  max_score uint [not null] // энэ түвшинд хүрэх дээд оноо
  description text
  icon varchar(50) // level icon
  color varchar(7) // level color
  badge_image varchar(255) // badge зураг
  perks text // энэ түвшинд авах давуу тал (JSON format)
  created_at timestamp [default: `now()`]
}

Table user_achievements {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  achievement_type varchar(50) [not null] // "level_up", "streak", "milestone", etc.
  title varchar(255) [not null]
  description text
  badge_icon varchar(50)
  points_earned uint [default: 0]
  unlocked_at timestamp [default: `now()`]
  is_featured boolean [default: false] // featured achievements
}

Table user_streaks {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  streak_type varchar(50) [not null] // "journal", "mood", "meditation", "lesson"
  current_streak int [default: 0] // одоогийн дараалсан өдрүүд
  longest_streak int [default: 0] // хамгийн урт дараалсан өдрүүд
  last_activity_date date
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (user_id, streak_type) [unique]
  }
}

////////////////////////////////////////////////// 
// JOURNAL & MOOD 
//////////////////////////////////////////////////
Table journals {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  title varchar(255) // журнал бичлэгийн гарчиг
  entry_date date [not null]
  content text [not null]
  word_count int // үгийн тоо
  sentiment_score decimal(3,2) // AI-ээр гаргасан сэтгэлийн оноо
  is_private boolean [default: true]
  tags varchar(500) // JSON array эсвэл comma-separated
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table mood_categories {
  id uint [pk, increment]
  name varchar(50) [not null]
  color varchar(7) // hex color code
  icon varchar(50) // icon name
  created_at timestamp [default: `now()`]
}

Table moods {
  id uint [pk, increment]
  category_id uint [ref: > mood_categories.id, not null]
  name varchar(50) [not null]
  description text
  intensity_level int [note: '1-10 scale'] // эрчмийн түвшин
  emoji varchar(10)
  created_at timestamp [default: `now()`]
}

Table mood_entries {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  entry_date date [not null]
  mood_id uint [ref: > moods.id, not null]
  intensity int [note: '1-10 scale']
  when_felt varchar(20) [note: 'morning|afternoon|evening|night']
  trigger_event text // юунаас болж энэ сэтгэлийн байдал үүссэн
  coping_strategy text // хэрхэн даван туулсан
  notes text
  location varchar(100) // хаана байсан
  weather varchar(50) // цаг агаар
  created_at timestamp [default: `now()`]
  
  indexes {
    (user_id, entry_date)
    (entry_date)
  }
}

////////////////////////////////////////////////// 
// CORE VALUES & GOALS 
//////////////////////////////////////////////////
Table core_values {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  name varchar(100) [not null]
  description text
  priority_order int // эрэмбийн дараалал
  color varchar(7) // visualization-д ашиглах өнгө
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table goals {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  value_id uint [ref: > core_values.id, delete: set null] // optional link
  title varchar(255) [not null]
  description text
  goal_type varchar(20) [note: 'short_term|long_term|daily|weekly|monthly']
  target_date date
  status varchar(20) [default: 'active', note: 'active|completed|paused|cancelled']
  progress_percentage int [default: 0, note: '0-100']
  is_public boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  completed_at timestamp
}

Table goal_milestones {
  id uint [pk, increment]
  goal_id uint [ref: > goals.id, not null]
  title varchar(255) [not null]
  description text
  target_date date
  is_completed boolean [default: false]
  completed_at timestamp
  created_at timestamp [default: `now()`]
}

////////////////////////////////////////////////// 
// LESSONS & CONTENT 
//////////////////////////////////////////////////
Table lesson_categories {
  id uint [pk, increment]
  name varchar(100) [not null]
  description text
  icon varchar(50)
  color varchar(7)
  sort_order int
  created_at timestamp [default: `now()`]
}

Table lessons {
  id uint [pk, increment]
  category_id uint [ref: > lesson_categories.id, not null]
  parent_id uint [ref: > lessons.id] // дэд хичээлийн хувьд
  title varchar(255) [not null]
  slug varchar(255) [unique] // URL-friendly version
  description text
  content text // article content
  lesson_type varchar(20) [note: 'article|meditation|video|audio|interactive']
  difficulty_level varchar(20) [note: 'beginner|intermediate|advanced']
  required_level uint [default: 1] // шаардагдах хэрэглэгчийн түвшин
  estimated_duration int // минутаар
  points_reward uint [default: 0] // дууссаны дараа олох оноо
  media_url varchar(500) // file path эсвэл URL
  thumbnail_url varchar(500)
  tags varchar(500) // JSON array
  is_premium boolean [default: false]
  is_published boolean [default: false]
  view_count int [default: 0]
  sort_order int
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  published_at timestamp
}

////////////////////////////////////////////////// 
// LESSON INTERACTIONS & PROGRESS 
//////////////////////////////////////////////////
Table lesson_comments {
  id uint [pk, increment]
  lesson_id uint [ref: > lessons.id, not null]
  user_id uint [ref: > users.id, not null]
  parent_id uint [ref: > lesson_comments.id] // reply functionality
  content text [not null]
  is_edited boolean [default: false]
  is_deleted boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table lesson_reactions {
  id uint [pk, increment]
  lesson_id uint [ref: > lessons.id, not null]
  user_id uint [ref: > users.id, not null]
  reaction_type varchar(20) [note: 'like|love|helpful|inspiring|bookmark']
  created_at timestamp [default: `now()`]
  
  indexes {
    (lesson_id, user_id, reaction_type) [unique]
  }
}

Table user_lesson_progress {
  id uint [pk, increment]
  lesson_id uint [ref: > lessons.id, not null]
  user_id uint [ref: > users.id, not null]
  progress_percentage int [default: 0, note: '0-100']
  status varchar(20) [default: 'not_started', note: 'not_started|in_progress|completed|bookmarked']
  time_spent int [default: 0] // секундээр
  last_accessed timestamp
  completion_date timestamp
  rating int [note: '1-5 stars']
  review_text text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (user_id, lesson_id) [unique]
    (user_id, status)
  }
}

////////////////////////////////////////////////// 
// MEDITATION & PRACTICE 
//////////////////////////////////////////////////
Table meditation_techniques {
  id uint [pk, increment]
  name varchar(100) [not null]
  description text
  instructions text
  difficulty_level varchar(20)
  recommended_duration int // минутаар
  created_at timestamp [default: `now()`]
}

Table meditation_sessions {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  technique_id uint [ref: > meditation_techniques.id]
  session_date date [not null]
  start_time timestamp
  duration_planned int // төлөвлөсөн хугацаа (минут)
  duration_actual int // бодит хугацаа (минут)
  quality_rating int [note: '1-5 scale']
  mood_before varchar(50)
  mood_after varchar(50)
  notes text
  interruptions int [default: 0] // хэдэн удаа тасалдсан
  environment varchar(100) // хаана хийсэн
  created_at timestamp [default: `now()`]
  
  indexes {
    (user_id, session_date)
  }
}

////////////////////////////////////////////////// 
// ADVANCED AI ANALYSIS & SCORING SYSTEM 
//////////////////////////////////////////////////
Table ai_scoring_criteria {
  id uint [pk, increment]
  criteria_name varchar(100) [not null] // "emotional_depth", "self_reflection", "goal_alignment", etc.
  description text
  max_points uint [default: 10]
  weight decimal(3,2) [default: 1.0] // жишээ нь emotional_depth илүү чухал бол 1.5
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
}

Table ai_journal_detailed_analysis {
  id uint [pk, increment]
  journal_id uint [ref: > journals.id, not null]
  user_id uint [ref: > users.id, not null]
  
  // Sentiment & Emotion Analysis
  overall_sentiment decimal(3,2) [note: '-1.0 to 1.0']
  primary_emotions varchar(500) // JSON array: ["joy", "anxiety", "hope"]
  emotion_intensity decimal(3,2) [note: '0.0 to 1.0']
  
  // Content Quality Scoring
  emotional_depth_score uint [note: '1-10, хэр гүн сэтгэлээ илэрхийлсэн']
  self_reflection_score uint [note: '1-10, өөртөө хэр их бодолтой ханласан']
  goal_alignment_score uint [note: '1-10, зорилготойгоо хэр уялдсан']
  gratitude_score uint [note: '1-10, талархлын илэрхийлэл']
  problem_solving_score uint [note: '1-10, асуудлыг шийдэх оролдлого']
  mindfulness_score uint [note: '1-10, одоо мөчид анхаарал хандуулсан']
  
  // Behavioral Insights
  stress_indicators text // stress-ийн шинж тэмдгүүд
  positive_patterns text // эерэг хэв маяг
  concerning_patterns text // санаа зовоосон хэв маяг
  growth_indicators text // хөгжлийн шинж тэмдэг
  
  // Recommendations & Feedback
  personalized_feedback text // хувийн санал зөвлөмж
  suggested_actions varchar(500) // JSON array санал болгосон үйлдлүүд
  recommended_lessons varchar(200) // JSON array санал болгосон хичээлүүд
  
  // Scoring
  total_weighted_score decimal(5,2) // нийт жигнэсэн оноо
  bonus_points uint [default: 0] // нэмэлт оноо (streak, consistency, etc.)
  final_points uint // эцсийн авсан оноо
  
  // AI Confidence & Processing
  ai_confidence decimal(3,2) [note: '0.0 to 1.0, AI хэр итгэлтэй']
  processing_version varchar(10) [default: 'v1.0'] // AI model version
  processing_duration int // AI боловсруулсан хугацаа (ms)
  
  created_at timestamp [default: `now()`]
  
  indexes {
    (user_id, created_at)
    (journal_id)
  }
}

Table ai_mood_analysis {
  id uint [pk, increment]
  mood_entry_id uint [ref: > mood_entries.id, not null]
  user_id uint [ref: > users.id, not null]
  
  // Pattern Recognition
  mood_consistency_score uint [note: '1-10, сэтгэлийн байдлын тогтвортой байдал']
  trigger_pattern_score uint [note: '1-10, trigger-үүдийг ойлгож буй байдал']
  coping_effectiveness_score uint [note: '1-10, даван туулах аргын үр дүн']
  emotional_intelligence_score uint [note: '1-10, сэтгэл хөдлөлийн оюун ухаан']
  
  // Insights
  detected_patterns text // AI илрүүлсэн хэв маяг
  improvement_suggestions text // сайжруулах санал
  warning_flags text // анхааруулах зүйлс
  
  points_earned uint [default: 0]
  created_at timestamp [default: `now()`]
}

Table ai_progress_tracking {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  
  // Weekly/Monthly Trends
  analysis_period varchar(20) [note: 'weekly|monthly']
  period_start date [not null]
  period_end date [not null]
  
  // Progress Metrics
  journal_consistency_score uint [note: '1-100']
  mood_stability_trend decimal(3,2) [note: 'positive/negative trend']
  goal_progress_rate decimal(5,2) [note: 'average % progress per period']
  meditation_regularity_score uint [note: '1-100']
  overall_wellbeing_trend decimal(3,2) [note: '-1.0 to 1.0']
  
  // AI Insights
  key_improvements text
  areas_needing_attention text
  behavioral_changes_detected text
  recommended_focus_areas varchar(500) // JSON array
  
  // Scoring
  period_total_points uint
  improvement_bonus_points uint [default: 0] // сайжрах хандлагаас авсан нэмэлт оноо
  consistency_bonus_points uint [default: 0] // тогтмол байснаас авсан оноо
  
  generated_at timestamp [default: `now()`]
  
  indexes {
    (user_id, analysis_period, period_start)
  }
}

Table scoring_history {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  source_type varchar(20) [not null] // "journal", "mood", "meditation", "lesson", "goal", "bonus"
  source_id uint // журнал, mood entry, гэх мэт ID
  points_earned uint [not null]
  points_type varchar(50) // "base_score", "quality_bonus", "streak_bonus", "improvement_bonus"
  description text // оноо авсан шалтгаан
  created_at timestamp [default: `now()`]
  
  indexes {
    (user_id, created_at)
    (user_id, source_type)
  }
}

Table user_insights {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  insight_type varchar(50) [note: 'mood_pattern|goal_progress|meditation_streak|etc']
  title varchar(255)
  description text
  data_points text // JSON format
  period_start date
  period_end date
  is_read boolean [default: false]
  priority varchar(20) [default: 'normal', note: 'low|normal|high']
  created_at timestamp [default: `now()`]
}

Table progress_reports {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  report_type varchar(20) [note: 'weekly|monthly|quarterly']
  period_start date [not null]
  period_end date [not null]
  overall_wellbeing_score int [note: '1-100 scale']
  mood_summary text
  journal_insights text
  goal_progress text
  meditation_summary text
  key_achievements text
  areas_for_improvement text
  personalized_recommendations text
  generated_at timestamp [default: `now()`]
  
  indexes {
    (user_id, report_type, period_start)
  }
}

////////////////////////////////////////////////// 
// NOTIFICATIONS & REMINDERS 
//////////////////////////////////////////////////
Table user_preferences {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  reminder_journal boolean [default: true]
  reminder_mood_check boolean [default: true]
  reminder_meditation boolean [default: true]
  reminder_time varchar(5) [default: '20:00'] // HH:MM format
  notification_email boolean [default: true]
  notification_push boolean [default: true]
  privacy_level varchar(20) [default: 'private']
  theme varchar(20) [default: 'light']
  language varchar(5) [default: 'en']
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table notifications {
  id uint [pk, increment]
  user_id uint [ref: > users.id, not null]
  title varchar(255) [not null]
  message text
  notification_type varchar(50) [note: 'reminder|insight|achievement|system']
  is_read boolean [default: false]
  action_url varchar(500)
  scheduled_for timestamp
  sent_at timestamp
  created_at timestamp [default: `now()`]
  
  indexes {
    (user_id, is_read)
    (scheduled_for)
  }
}

////////////////////////////////////////////////// 
// EXAMPLE DATA SETUP
//////////////////////////////////////////////////

/*
Level системийн жишээ data:

INSERT INTO user_levels VALUES 
(1, 1, 'Beginner Explorer', 0, 99, 'Starting your mindfulness journey', 'seedling', '#4CAF50', 'badge1.png', '{"lessons": ["basic"], "features": ["journal", "mood"]}'),
(2, 2, 'Mindful Wanderer', 100, 249, 'Building consistent habits', 'walking', '#2196F3', 'badge2.png', '{"lessons": ["intermediate"], "features": ["all"], "bonus_points": 1.1}'),
(3, 3, 'Reflection Master', 250, 499, 'Deep self-awareness achieved', 'mountain', '#FF9800', 'badge3.png', '{"lessons": ["advanced"], "features": ["all"], "bonus_points": 1.2}'),
(4, 4, 'Zen Guardian', 500, 999, 'Wisdom and balance', 'lotus', '#9C27B0', 'badge4.png', '{"lessons": ["expert"], "features": ["all"], "bonus_points": 1.5}');

AI Scoring criteria жишээ:
INSERT INTO ai_scoring_criteria VALUES
(1, 'emotional_depth', 'How deeply emotions are expressed', 15, 1.2, true),
(2, 'self_reflection', 'Level of introspection and self-awareness', 12, 1.1, true),
(3, 'goal_alignment', 'Connection to personal values and goals', 10, 1.0, true),
(4, 'gratitude_expression', 'Presence of thankfulness and positivity', 8, 0.9, true),
(5, 'problem_solving', 'Efforts to address challenges constructively', 10, 1.0, true),
(6, 'mindfulness', 'Present-moment awareness', 10, 1.0, true);
*/