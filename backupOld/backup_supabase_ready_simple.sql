CREATE TABLE mindstep.ai_journal_detailed_analysis (
CREATE TABLE mindstep.ai_mood_analysis (
CREATE TABLE mindstep.ai_progress_tracking (
CREATE TABLE mindstep.ai_scoring_criteria (
CREATE TABLE mindstep.ai_weekly_mood_deep_analysis (
CREATE TABLE mindstep.auth_otp (
CREATE TABLE mindstep.core_values (
CREATE TABLE mindstep.data_retention_policies (
CREATE TABLE mindstep.deleted_data_log (
CREATE TABLE mindstep.detected_patterns (
CREATE TABLE mindstep.encryption_keys (
CREATE TABLE mindstep.error_logs (
CREATE TABLE mindstep.goal_milestones (
CREATE TABLE mindstep.goals (
CREATE TABLE mindstep.hawkins_levels (
CREATE TABLE mindstep.hawkins_maslow (
CREATE TABLE mindstep.journals (
CREATE TABLE mindstep.lesson_categories (
CREATE TABLE mindstep.lesson_comments (
CREATE TABLE mindstep.lesson_reactions (
CREATE TABLE mindstep.lesson_recommendations (
CREATE TABLE mindstep.lessons (
CREATE TABLE mindstep.maslow_levels (
CREATE TABLE mindstep.meditation_sessions (
CREATE TABLE mindstep.meditation_techniques (
CREATE TABLE mindstep.mood_categories (
CREATE TABLE mindstep.mood_entries (
CREATE TABLE mindstep.mood_unit (
CREATE TABLE mindstep.notifications (
CREATE TABLE mindstep.plutchik_combinations (
CREATE TABLE mindstep.plutchik_emotions (
CREATE TABLE mindstep.progress_reports (
CREATE TABLE mindstep.revoked_tokens (
CREATE TABLE mindstep.role_owners (
CREATE TABLE mindstep.roles (
CREATE TABLE mindstep.scoring_history (
CREATE TABLE mindstep.system_audit_log (
CREATE TABLE mindstep.system_settings (
CREATE TABLE mindstep.user_achievements (
CREATE TABLE mindstep.user_data_access_log (
CREATE TABLE mindstep.user_data_requests (
CREATE TABLE mindstep.user_emotion_wheel (
CREATE TABLE mindstep.user_gamification (
CREATE TABLE mindstep.user_hawkins_maslow (
CREATE TABLE mindstep.user_insights (
CREATE TABLE mindstep.user_lesson_progress (
CREATE TABLE mindstep.user_levels (
CREATE TABLE mindstep.user_preferences (
CREATE TABLE mindstep.user_sessions (
CREATE TABLE mindstep.user_streaks (
CREATE TABLE mindstep.users (
CREATE TABLE mindstep.value_reflections (
CREATE INDEX idx_access_log_accessor ON mindstep.user_data_access_log USING btree (accessed_by_id, accessed_at DESC);
CREATE INDEX idx_access_log_user ON mindstep.user_data_access_log USING btree (user_id, accessed_at DESC);
CREATE INDEX idx_achievements_type ON mindstep.user_achievements USING btree (achievement_type, achievement_category);
CREATE INDEX idx_achievements_user ON mindstep.user_achievements USING btree (user_id, unlocked_at DESC);
CREATE INDEX idx_ai_journal_analysis_journal ON mindstep.ai_journal_detailed_analysis USING btree (journal_id);
CREATE INDEX idx_ai_journal_analysis_user ON mindstep.ai_journal_detailed_analysis USING btree (user_id, created_at DESC);
CREATE INDEX idx_ai_mood_analysis_mood ON mindstep.ai_mood_analysis USING btree (mood_entry_id);
CREATE INDEX idx_ai_mood_analysis_user ON mindstep.ai_mood_analysis USING btree (user_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON mindstep.system_audit_log USING btree (action_type, created_at DESC);
CREATE INDEX idx_audit_log_user ON mindstep.system_audit_log USING btree (user_id, created_at DESC);
CREATE INDEX idx_auth_otp_user_type ON mindstep.auth_otp USING btree (user_id, otp_type, expired_at);
CREATE INDEX idx_core_values_user ON mindstep.core_values USING btree (user_id, is_active, priority_order);
CREATE INDEX idx_data_requests_user ON mindstep.user_data_requests USING btree (user_id, status, created_at DESC);
CREATE INDEX idx_deleted_log_user ON mindstep.deleted_data_log USING btree (user_id, deleted_at DESC);
CREATE INDEX idx_emotion_wheel_mood ON mindstep.user_emotion_wheel USING btree (mood_entry_id);
CREATE INDEX idx_emotion_wheel_user ON mindstep.user_emotion_wheel USING btree (user_id, recorded_at DESC);
CREATE INDEX idx_error_logs_unresolved ON mindstep.error_logs USING btree (is_resolved, created_at DESC);
CREATE INDEX idx_gamification_user_id ON mindstep.user_gamification USING btree (user_id);
CREATE INDEX idx_goals_user_status ON mindstep.goals USING btree (user_id, status, target_date) WHERE (deleted_at IS NULL);
CREATE INDEX idx_insights_user_unread ON mindstep.user_insights USING btree (user_id, is_read, priority, created_at DESC);
CREATE INDEX idx_journals_content_search ON mindstep.journals USING gin (to_tsvector('english'::regconfig, content)) WHERE (deleted_at IS NULL);
CREATE INDEX idx_journals_tags ON mindstep.journals USING gin (tags) WHERE (deleted_at IS NULL);
CREATE INDEX idx_journals_user_created ON mindstep.journals USING btree (user_id, created_at DESC) WHERE (deleted_at IS NULL);
CREATE INDEX idx_lesson_comments_lesson ON mindstep.lesson_comments USING btree (lesson_id, created_at DESC) WHERE (is_deleted = false);
CREATE INDEX idx_lesson_progress_user_status ON mindstep.user_lesson_progress USING btree (user_id, status, last_accessed DESC);
CREATE INDEX idx_lesson_reactions_lesson ON mindstep.lesson_reactions USING btree (lesson_id, reaction_type);
CREATE INDEX idx_lesson_recommendations_user ON mindstep.lesson_recommendations USING btree (user_id, priority_score DESC, created_at DESC) WHERE (is_dismissed = false);
CREATE INDEX idx_lessons_published ON mindstep.lessons USING btree (is_published, category_id, sort_order) WHERE (deleted_at IS NULL);
CREATE INDEX idx_lessons_slug ON mindstep.lessons USING btree (slug) WHERE (is_published = true);
CREATE INDEX idx_lessons_tags ON mindstep.lessons USING gin (tags);
CREATE INDEX idx_meditation_sessions_user_date ON mindstep.meditation_sessions USING btree (user_id, session_date DESC);
CREATE INDEX idx_milestones_goal ON mindstep.goal_milestones USING btree (goal_id, sort_order);
CREATE INDEX idx_notifications_scheduled ON mindstep.notifications USING btree (scheduled_for) WHERE (sent_at IS NULL);
CREATE INDEX idx_notifications_user_unread ON mindstep.notifications USING btree (user_id, is_read, created_at DESC);
CREATE INDEX idx_patterns_severity ON mindstep.detected_patterns USING btree (user_id, severity, created_at DESC) WHERE (is_resolved = false);
CREATE INDEX idx_patterns_user_type ON mindstep.detected_patterns USING btree (user_id, pattern_type, is_resolved);
CREATE INDEX idx_progress_tracking_user ON mindstep.ai_progress_tracking USING btree (user_id, period_start DESC);
CREATE INDEX idx_reports_user ON mindstep.progress_reports USING btree (user_id, period_start DESC);
CREATE INDEX idx_revoked_tokens_hash ON mindstep.revoked_tokens USING btree (token_hash, expires_at);
CREATE INDEX idx_role_owners_user ON mindstep.role_owners USING btree (owner_id, status);
CREATE INDEX idx_scoring_source ON mindstep.scoring_history USING btree (source_type, source_id);
CREATE INDEX idx_scoring_user_created ON mindstep.scoring_history USING btree (user_id, created_at DESC);
CREATE INDEX idx_sessions_token ON mindstep.user_sessions USING btree (token_hash) WHERE (is_active = true);
CREATE INDEX idx_sessions_user_active ON mindstep.user_sessions USING btree (user_id, is_active, expires_at);
CREATE INDEX idx_streaks_user_type ON mindstep.user_streaks USING btree (user_id, streak_type);
CREATE INDEX idx_users_active ON mindstep.users USING btree (is_active, deleted_at);
CREATE INDEX idx_users_email ON mindstep.users USING btree (email) WHERE (deleted_at IS NULL);
CREATE INDEX idx_value_reflections_user_value ON mindstep.value_reflections USING btree (user_id, value_id, reflection_date DESC);
CREATE INDEX idx_weekly_mood_analysis_user ON mindstep.ai_weekly_mood_deep_analysis USING btree (user_id, analysis_week DESC);
CREATE INDEX weekly_activity_summary_user_id_week_start_idx ON mindstep.weekly_activity_summary USING btree (user_id, week_start DESC);
