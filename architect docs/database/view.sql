-- ============================================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- ============================================================================

-- User statistics summary
CREATE MATERIALIZED VIEW user_stats_summary AS
SELECT 
  u.id as user_id,
  u.name,
  u.current_level,
  u.total_score,
  COUNT(DISTINCT j.id) as total_journals,
  COUNT(DISTINCT m.id) as total_mood_entries,
  COUNT(DISTINCT ms.id) as total_meditation_sessions,
  COUNT(DISTINCT g.id) as total_goals,
  COUNT(DISTINCT g.id) FILTER (WHERE g.status = 'completed') as completed_goals,
  COUNT(DISTINCT ulp.id) FILTER (WHERE ulp.status = 'completed') as completed_lessons,
  MAX(j.created_at) as last_journal_date,
  MAX(m.created_at) as last_mood_entry_date,
  MAX(ms.created_at) as last_meditation_date
FROM users u
LEFT JOIN journals j ON u.id = j.user_id AND j.deleted_at IS NULL
LEFT JOIN mood_entries m ON u.id = m.user_id
LEFT JOIN meditation_sessions ms ON u.id = ms.user_id
LEFT JOIN goals g ON u.id = g.user_id AND g.deleted_at IS NULL
LEFT JOIN user_lesson_progress ulp ON u.id = ulp.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.name, u.current_level, u.total_score;

CREATE UNIQUE INDEX ON user_stats_summary(user_id);

-- Weekly activity summary
CREATE MATERIALIZED VIEW weekly_activity_summary AS
SELECT 
  user_id,
  DATE_TRUNC('week', created_at)::DATE as week_start,
  source_type,
  COUNT(*) as activity_count,
  SUM(points_earned) as total_points
FROM scoring_history
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY user_id, DATE_TRUNC('week', created_at), source_type;

CREATE INDEX ON weekly_activity_summary(user_id, week_start DESC);

