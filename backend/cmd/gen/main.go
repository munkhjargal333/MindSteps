package main

import (
	"fmt"
	"mindsteps/config"
	"mindsteps/database"

	"gorm.io/gen"
	"gorm.io/gorm/logger"
)

// func tag(columnName string) string {
// 	return columnName
// }

func model(name string) string {
	db := config.Get().DB
	return fmt.Sprintf("%s.%s", db.Schema, name)
}

func main() {
	config.MustLoad()
	database.MustConnect(logger.Info)

	g := gen.NewGenerator(gen.Config{
		OutPath:           "./database/query",
		ModelPkgPath:      "./database/model",
		FieldNullable:     false,
		FieldCoverable:    false,
		FieldSignable:     true,
		FieldWithIndexTag: true,
		FieldWithTypeTag:  true,
	})
	g.UseDB(database.DB)

	// ============================================================================
	// CORE USER MANAGEMENT
	// ============================================================================

	// Users table
	users := g.GenerateModelAs(
		model("users"),
		"Users",
		gen.FieldType("id", "uint"),
		gen.FieldType("uuid", "string"),
		gen.FieldType("total_score", "int"),
		gen.FieldType("current_level", "int"),
		gen.FieldType("level_progress", "int"),
		gen.FieldType("is_active", "bool"),
		gen.FieldType("is_email_verified", "bool"),
		gen.FieldType("login_count", "int"),
		gen.FieldType("password", "string"),
		//gen.FieldIgnore("password"),
		gen.FieldIgnore("deleted_at"),
	)

	// Roles table
	roles := g.GenerateModelAs(
		model("roles"),
		"Roles",
		gen.FieldType("id", "uint"),
		gen.FieldType("level", "int16"),
		gen.FieldType("created_by_id", "uint"),
		gen.FieldType("updated_by_id", "uint"),
		//gen.FieldJSONType("permissions"),
		gen.FieldType("permissions", "datatypes.JSON"),
	)

	// Role owners
	roleOwners := g.GenerateModelAs(
		model("role_owners"),
		"RoleOwners",
		gen.FieldType("id", "uint"),
		gen.FieldType("role_id", "uint"),
		gen.FieldType("owner_id", "uint"),
		gen.FieldType("assigned_by_id", "uint"),
	)

	// ============================================================================
	// AUTHENTICATION & SECURITY
	// ============================================================================

	// Auth OTP
	authOTP := g.GenerateModelAs(
		model("auth_otp"),
		"AuthOTP",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("is_used", "bool"),
		gen.FieldIgnore("deleted_at"),
	)

	// User sessions
	userSessions := g.GenerateModelAs(
		model("user_sessions"),
		"UserSessions",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("is_active", "bool"),
	)

	// Revoked tokens
	revokedTokens := g.GenerateModelAs(
		model("revoked_tokens"),
		"RevokedTokens",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
	)

	// Encryption keys
	encryptionKeys := g.GenerateModelAs(
		model("encryption_keys"),
		"EncryptionKeys",
		gen.FieldType("id", "uint"),
		gen.FieldType("key_version", "int"),
		gen.FieldType("is_active", "bool"),
		gen.FieldIgnore("encrypted_key"), // Sensitive data
	)

	// ============================================================================
	// GAMIFICATION SYSTEM
	// ============================================================================

	// User levels
	userLevels := g.GenerateModelAs(
		model("user_levels"),
		"UserLevels",
		gen.FieldType("id", "int"),
		gen.FieldType("level_number", "int"),
		gen.FieldType("min_score", "int"),
		gen.FieldType("max_score", "int"),
		//gen.FieldJSONType("perks"),
		gen.FieldType("perks", "datatypes.JSON"),
	)

	// User achievements
	userAchievements := g.GenerateModelAs(
		model("user_achievements"),
		"UserAchievements",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("points_earned", "int"),
		gen.FieldType("is_featured", "bool"),
	)

	// User streaks
	userStreaks := g.GenerateModelAs(
		model("user_streaks"),
		"UserStreaks",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("current_streak", "int"),
		gen.FieldType("longest_streak", "int"),
		gen.FieldType("total_activities", "int"),
	)

	// Scoring history
	scoringHistory := g.GenerateModelAs(
		model("scoring_history"),
		"ScoringHistory",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("source_id", "uint"),
		gen.FieldType("points_earned", "int"),
		//gen.FieldJSONType("metadata"),
		gen.FieldType("metadata", "datatypes.JSON"),
	)

	// ============================================================================
	// MASLOW'S HIERARCHY & CORE VALUES
	// ============================================================================

	// Maslow levels
	maslowLevels := g.GenerateModelAs(
		model("maslow_levels"),
		"MaslowLevels",
		gen.FieldType("id", "int"),
		gen.FieldType("level_number", "int"),
		gen.FieldType("sort_order", "int"),
	)

	// Core values
	coreValues := g.GenerateModelAs(
		model("core_values"),
		"CoreValues",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("maslow_level_id", "int"),
		gen.FieldType("priority_order", "int"),
		gen.FieldType("is_active", "bool"),
	)

	// Value reflections
	valueReflections := g.GenerateModelAs(
		model("value_reflections"),
		"ValueReflections",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("value_id", "uint"),
		gen.FieldType("source_id", "uint"),
		gen.FieldType("alignment_score", "int"),
	)

	// ============================================================================
	// CONSCIOUSNESS LEVELS (David Hawkins)
	// ============================================================================

	// Consciousness levels
	consciousnessLevels := g.GenerateModelAs(
		model("consciousness_levels"),
		"ConsciousnessLevels",
		gen.FieldType("id", "int"),
		gen.FieldType("level_score", "int"),
		gen.FieldType("sort_order", "int"),
	)

	// User consciousness tracking
	userConsciousnessTracking := g.GenerateModelAs(
		model("user_consciousness_tracking"),
		"UserConsciousnessTracking",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("consciousness_score", "int"),
		gen.FieldType("primary_level_id", "int"),
		gen.FieldType("source_id", "uint"),
	)

	// ============================================================================
	// PLUTCHIK'S EMOTION WHEEL
	// ============================================================================

	// Plutchik emotions
	plutchikEmotions := g.GenerateModelAs(
		model("plutchik_emotions"),
		"PlutchikEmotions",
		gen.FieldType("id", "int"),
		gen.FieldType("opposite_emotion_id", "int"),
		gen.FieldType("intensity_level", "int"),
		gen.FieldType("base_emotion_id", "int"),
	)

	// Plutchik combinations
	plutchikCombinations := g.GenerateModelAs(
		model("plutchik_combinations"),
		"PlutchikCombinations",
		gen.FieldType("id", "int"),
		gen.FieldType("emotion1_id", "int"),
		gen.FieldType("emotion2_id", "int"),
	)

	// User emotion wheel
	userEmotionWheel := g.GenerateModelAs(
		model("user_emotion_wheel"),
		"UserEmotionWheel",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("mood_entry_id", "uint"),
		gen.FieldType("journal_id", "uint"),
		gen.FieldType("plutchik_emotion_id", "int"),
		gen.FieldType("intensity", "int"),
		gen.FieldType("detected_combination_id", "int"),
		gen.FieldType("is_ai_detected", "bool"),
	)

	// ============================================================================
	// JOURNALS
	// ============================================================================

	journals := g.GenerateModelAs(
		model("journals"),
		"Journals",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("word_count", "int"),
		//gen.FieldType("encryption_key_id", "uint"),
		gen.FieldType("is_private", "bool"),
		//gen.FieldIgnore("content_encrypted"), // Encrypted field
		gen.FieldIgnore("deleted_at"),

		// gen.FieldJSONTagWithNS(func(columnName string) string {
		// 	switch columnName {
		// 	default:
		// 		return "-"
		// 	}
		// }),
	)

	// ============================================================================
	// MOOD TRACKING
	// ============================================================================

	// Mood categories
	moodCategories := g.GenerateModelAs(
		model("mood_categories"),
		"MoodCategories",
		gen.FieldType("id", "int"),
		gen.FieldType("sort_order", "int"),
	)

	// Moods
	moods := g.GenerateModelAs(
		model("moods"),
		"Moods",
		gen.FieldType("id", "int"),
		gen.FieldType("category_id", "int"),
		gen.FieldType("intensity_level", "int"),

		// gen.FieldJSONTagWithNS(func(columnName string) string {
		// 	return fmt.Sprintf(`-`, columnName)
		// }),
	)

	// Mood entries
	moodEntries := g.GenerateModelAs(
		model("mood_entries"),
		"MoodEntries",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("mood_id", "int"),
		gen.FieldType("intensity", "int"),
		gen.FieldType("trigger_event", "string"),
		gen.FieldType("related_value_ids", "uint"),

		// gen.FieldJSONTagWithNS(func(columnName string) string {
		// 	return fmt.Sprintf(`-`, columnName)
		// }),
	)

	// ============================================================================
	// GOALS & MILESTONES
	// ============================================================================

	// Goals
	goals := g.GenerateModelAs(
		model("goals"),
		"Goals",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("value_id", "uint"),
		gen.FieldType("progress_percentage", "int"),
		gen.FieldType("is_public", "bool"),
		gen.FieldIgnore("deleted_at"),
	)

	// Goal milestones
	goalMilestones := g.GenerateModelAs(
		model("goal_milestones"),
		"GoalMilestones",
		gen.FieldType("id", "uint"),
		gen.FieldType("goal_id", "uint"),
		gen.FieldType("is_completed", "bool"),
		gen.FieldType("sort_order", "int"),
	)

	// ============================================================================
	// LESSONS & LEARNING
	// ============================================================================

	// Lesson categories
	lessonCategories := g.GenerateModelAs(
		model("lesson_categories"),
		"LessonCategories",
		gen.FieldType("id", "int"),
		gen.FieldType("parent_id", "int"),
		gen.FieldType("sort_order", "int"),
		gen.FieldType("is_active", "bool"),
	)

	// Lessons
	lessons := g.GenerateModelAs(
		model("lessons"),
		"Lessons",
		gen.FieldType("id", "uint"),
		gen.FieldType("category_id", "int"),
		gen.FieldType("parent_id", "uint"),
		gen.FieldType("required_level", "int"),
		gen.FieldType("estimated_duration", "int"),
		gen.FieldType("points_reward", "int"),
		gen.FieldType("is_premium", "bool"),
		gen.FieldType("is_published", "bool"),
		gen.FieldType("view_count", "int"),
		gen.FieldType("like_count", "int"),
		gen.FieldType("sort_order", "int"),
		gen.FieldIgnore("deleted_at"),
	)

	// User lesson progress
	userLessonProgress := g.GenerateModelAs(
		model("user_lesson_progress"),
		"UserLessonProgress",
		gen.FieldType("id", "uint"),
		gen.FieldType("lesson_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("progress_percentage", "int"),
		gen.FieldType("time_spent", "int"),
		gen.FieldType("rating", "int"),
		gen.FieldType("is_bookmarked", "bool"),
	)

	// Lesson recommendations
	lessonRecommendations := g.GenerateModelAs(
		model("lesson_recommendations"),
		"LessonRecommendations",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("lesson_id", "uint"),
		gen.FieldType("related_value_id", "uint"),
		gen.FieldType("related_pattern_id", "uint"),
		gen.FieldType("priority_score", "int"),
		gen.FieldType("is_dismissed", "bool"),
	)

	// Lesson comments
	lessonComments := g.GenerateModelAs(
		model("lesson_comments"),
		"LessonComments",
		gen.FieldType("id", "uint"),
		gen.FieldType("lesson_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("parent_id", "uint"),
		gen.FieldType("is_edited", "bool"),
		gen.FieldType("is_deleted", "bool"),
	)

	// Lesson reactions
	lessonReactions := g.GenerateModelAs(
		model("lesson_reactions"),
		"LessonReactions",
		gen.FieldType("id", "uint"),
		gen.FieldType("lesson_id", "uint"),
		gen.FieldType("user_id", "uint"),
	)

	// ============================================================================
	// MEDITATION & MINDFULNESS
	// ============================================================================

	// Meditation techniques
	meditationTechniques := g.GenerateModelAs(
		model("meditation_techniques"),
		"MeditationTechniques",
		gen.FieldType("id", "int"),
		gen.FieldType("recommended_duration", "int"),
		gen.FieldType("is_guided", "bool"),
		gen.FieldType("is_active", "bool"),
	)

	// Meditation sessions
	meditationSessions := g.GenerateModelAs(
		model("meditation_sessions"),
		"MeditationSessions",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("technique_id", "int"),
		gen.FieldType("duration_planned", "int"),
		gen.FieldType("duration_actual", "int"),
		gen.FieldType("quality_rating", "int"),
		gen.FieldType("focus_level", "int"),
		gen.FieldType("interruptions", "int"),
	)

	// ============================================================================
	// AI ANALYSIS & INSIGHTS
	// ============================================================================

	// AI scoring criteria
	aiScoringCriteria := g.GenerateModelAs(
		model("ai_scoring_criteria"),
		"AIScoringCriteria",
		gen.FieldType("id", "int"),
		gen.FieldType("max_points", "int"),
		gen.FieldType("is_active", "bool"),
	)

	// AI journal detailed analysis
	aiJournalDetailedAnalysis := g.GenerateModelAs(
		model("ai_journal_detailed_analysis"),
		"AIJournalDetailedAnalysis",
		gen.FieldType("id", "uint"),
		gen.FieldType("journal_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("emotional_depth_score", "int"),
		gen.FieldType("self_reflection_score", "int"),
		gen.FieldType("goal_alignment_score", "int"),
		gen.FieldType("gratitude_score", "int"),
		gen.FieldType("problem_solving_score", "int"),
		gen.FieldType("mindfulness_score", "int"),
		gen.FieldType("bonus_points", "int"),
		gen.FieldType("final_points", "int"),
		gen.FieldType("processing_duration", "int"),

		gen.FieldType("primary_emotions", "datatypes.JSON"),
	)

	// AI mood analysis
	aiMoodAnalysis := g.GenerateModelAs(
		model("ai_mood_analysis"),
		"AIMoodAnalysis",
		gen.FieldType("id", "uint"),
		gen.FieldType("mood_entry_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("mood_consistency_score", "int"),
		gen.FieldType("trigger_pattern_score", "int"),
		gen.FieldType("coping_effectiveness_score", "int"),
		gen.FieldType("emotional_intelligence_score", "int"),
		gen.FieldType("points_earned", "int"),
		gen.FieldType("detected_patterns", "datatypes.JSON"),
	)

	// AI weekly mood deep analysis
	aiWeeklyMoodDeepAnalysis := g.GenerateModelAs(
		model("ai_weekly_mood_deep_analysis"),
		"AIWeeklyMoodDeepAnalysis",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("hidden_emotional_patterns", "datatypes.JSON"),
		gen.FieldType("unconscious_triggers", "datatypes.JSON"),
		gen.FieldType("values_in_conflict", "datatypes.JSON"),
		gen.FieldType("values_being_honored", "datatypes.JSON"),
	)

	// AI progress tracking
	aiProgressTracking := g.GenerateModelAs(
		model("ai_progress_tracking"),
		"AIProgressTracking",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("journal_consistency_score", "int"),
		gen.FieldType("meditation_regularity_score", "int"),
		gen.FieldType("consciousness_level_change", "int"),
		gen.FieldType("period_total_points", "int"),
		gen.FieldType("improvement_bonus_points", "int"),
		gen.FieldType("consistency_bonus_points", "int"),
		gen.FieldType("key_improvements", "datatypes.JSON"),
		gen.FieldType("areas_needing_attention", "datatypes.JSON"),
		gen.FieldType("behavioral_changes_detected", "datatypes.JSON"),
	)

	// Detected patterns
	detectedPatterns := g.GenerateModelAs(
		model("detected_patterns"),
		"DetectedPatterns",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("occurrence_count", "int"),
		gen.FieldType("emotional_impact_score", "int"),
		gen.FieldType("is_resolved", "bool"),
		gen.FieldType("user_acknowledged", "bool"),
	)

	// ============================================================================
	// REPORTS & INSIGHTS
	// ============================================================================

	// User insights
	userInsights := g.GenerateModelAs(
		model("user_insights"),
		"UserInsights",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("is_read", "bool"),
		gen.FieldType("is_dismissed", "bool"),
		//		gen.FieldJSONType("data_points"),
		gen.FieldType("data_points", "datatypes.JSON"),
	)

	// Progress reports
	progressReports := g.GenerateModelAs(
		model("progress_reports"),
		"ProgressReports",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("overall_wellbeing_score", "int"),
		gen.FieldType("is_exported", "bool"),
		gen.FieldType("mood_summary", "datatypes.JSON"),
		gen.FieldType("journal_insights", "datatypes.JSON"),
		gen.FieldType("goal_progress", "datatypes.JSON"),
		gen.FieldType("meditation_summary", "datatypes.JSON"),
		gen.FieldType("consciousness_progression", "datatypes.JSON"),
		gen.FieldType("chart_data", "datatypes.JSON"),
	)

	// ============================================================================
	// NOTIFICATIONS & REMINDERS
	// ============================================================================

	// User preferences
	userPreferences := g.GenerateModelAs(
		model("user_preferences"),
		"UserPreferences",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("reminder_journal", "bool"),
		gen.FieldType("reminder_mood_check", "bool"),
		gen.FieldType("reminder_meditation", "bool"),
		gen.FieldType("reminder_goal_review", "bool"),
		gen.FieldType("notification_email", "bool"),
		gen.FieldType("notification_push", "bool"),
		gen.FieldType("notification_insights", "bool"),
		gen.FieldType("notification_achievements", "bool"),
		gen.FieldType("data_sharing", "bool"),
	)

	// Notifications
	notifications := g.GenerateModelAs(
		model("notifications"),
		"Notifications",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("is_read", "bool"),
		//gen.FieldJSONType("metadata"),
		gen.FieldType("metadata", "datatypes.JSON"),
	)

	// ============================================================================
	// DATA COMPLIANCE & PRIVACY (GDPR)
	// ============================================================================

	// Data retention policies
	dataRetentionPolicies := g.GenerateModelAs(
		model("data_retention_policies"),
		"DataRetentionPolicies",
		gen.FieldType("id", "int"),
		gen.FieldType("retention_days", "int"),
		gen.FieldType("archive_after_days", "int"),
		gen.FieldType("auto_delete", "bool"),
		gen.FieldType("is_active", "bool"),
	)

	// User data requests
	userDataRequests := g.GenerateModelAs(
		model("user_data_requests"),
		"UserDataRequests",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("processed_by_id", "uint"),
		gen.FieldType("backup_created", "bool"),
	)

	// User data access log
	userDataAccessLog := g.GenerateModelAs(
		model("user_data_access_log"),
		"UserDataAccessLog",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("accessed_by_id", "uint"),
		gen.FieldType("record_id", "uint"),
		gen.FieldType("session_id", "uint"),
	)

	// Deleted data log
	deletedDataLog := g.GenerateModelAs(
		model("deleted_data_log"),
		"DeletedDataLog",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("record_id", "uint"),
		gen.FieldType("deleted_by_id", "uint"),
		gen.FieldType("can_recover", "bool"),
		//gen.FieldJSONType("record_data"),
		gen.FieldType("record_data", "datatypes.JSON"),
	)

	// ============================================================================
	// SYSTEM ADMINISTRATION
	// ============================================================================

	// System settings
	systemSettings := g.GenerateModelAs(
		model("system_settings"),
		"SystemSettings",
		gen.FieldType("id", "int"),
		gen.FieldType("updated_by_id", "uint"),
		gen.FieldType("is_public", "bool"),
		gen.FieldType("is_editable", "bool"),
	)

	// System audit log
	systemAuditLog := g.GenerateModelAs(
		model("system_audit_log"),
		"SystemAuditLog",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("entity_id", "uint"),
		gen.FieldType("old_value", "datatypes.JSON"),
		gen.FieldType("new_value", "datatypes.JSON"),
	)

	// Error logs
	errorLogs := g.GenerateModelAs(
		model("error_logs"),
		"ErrorLogs",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("resolved_by_id", "uint"),
		gen.FieldType("is_resolved", "bool"),
	)

	// ============================================================================
	// EXECUTE GENERATION
	// ============================================================================

	g.ApplyBasic(
		// Core User Management
		users, roles, roleOwners,

		// Authentication & Security
		authOTP, userSessions, revokedTokens, encryptionKeys,

		// Gamification System
		userLevels, userAchievements, userStreaks, scoringHistory,

		// Maslow's Hierarchy & Core Values
		maslowLevels, coreValues, valueReflections,

		// Consciousness Levels
		consciousnessLevels, userConsciousnessTracking,

		// Plutchik's Emotion Wheel
		plutchikEmotions, plutchikCombinations, userEmotionWheel,

		// Journals
		journals,

		// Mood Tracking
		moodCategories, moods, moodEntries,

		// Goals & Milestones
		goals, goalMilestones,

		// Lessons & Learning
		lessonCategories, lessons, userLessonProgress,
		lessonRecommendations, lessonComments, lessonReactions,

		// Meditation & Mindfulness
		meditationTechniques, meditationSessions,

		// AI Analysis & Insights
		aiScoringCriteria, aiJournalDetailedAnalysis, aiMoodAnalysis,
		aiWeeklyMoodDeepAnalysis, aiProgressTracking, detectedPatterns,

		// Reports & Insights
		userInsights, progressReports,

		// Notifications & Reminders
		userPreferences, notifications,

		// Data Compliance & Privacy
		dataRetentionPolicies, userDataRequests,
		userDataAccessLog, deletedDataLog,

		// System Administration
		systemSettings, systemAuditLog, errorLogs,
	)

	// Execute the generator
	g.Execute()

	fmt.Println("✅ Successfully generated all models and queries!")
	fmt.Println("📁 Models generated in: ./database/model")
	fmt.Println("📁 Queries generated in: ./database/query")
	fmt.Println("\n📌 Total tables generated: 50+")
	fmt.Println("🔥 Ready to use GORM Gen queries!")
}
