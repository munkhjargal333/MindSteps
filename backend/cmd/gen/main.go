package main

import (
	"fmt"
	"mindsteps/config"
	"mindsteps/database"

	"gorm.io/gen"
	"gorm.io/gen/field"
	"gorm.io/gorm/logger"
)

func tag(columnName string) string {
	return columnName
}

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
		gen.FieldType("perks", "datatypes.JSON"),
	)

	// User gamification summary
	userGamification := g.GenerateModelAs(
		model("user_gamification"),
		"UserGamification",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("current_level_id", "int"),
		gen.FieldType("total_score", "int"),
		gen.FieldType("level_progress", "int"),
		gen.FieldType("current_streak", "int"),
		gen.FieldType("longest_streak", "int"),
		gen.FieldType("last_activity_at", "time.Time"),
		gen.FieldRelate(field.BelongsTo, "Level", userLevels, &field.RelateConfig{
			RelatePointer: true,
			GORMTag:       field.GormTag{"foreignKey": []string{"current_level_id"}},
		}),
	)

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
		gen.FieldIgnore("deleted_at"),

		gen.FieldRelate(field.HasOne, "Gamification", userGamification, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"}, // UserGamification хүснэгт дээрх багана
				"references": []string{"ID"},      // Users хүснэгт дээрх багана
			},
			JSONTag: "gamification",
		}),
	)

	// Scoring history
	scoringHistory := g.GenerateModelAs(
		model("scoring_history"),
		"ScoringHistory",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("source_id", "uint"),
		gen.FieldType("points_earned", "int"),
		gen.FieldType("metadata", "datatypes.JSON"),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
	)

	// Roles table
	roles := g.GenerateModelAs(
		model("roles"),
		"Roles",
		gen.FieldType("id", "uint"),
		gen.FieldType("level", "int16"),
		gen.FieldType("created_by_id", "uint"),
		gen.FieldType("updated_by_id", "uint"),
		gen.FieldType("permissions", "datatypes.JSON"),
		gen.FieldRelate(field.BelongsTo, "CreatedBy", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"created_by_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("CreatedBy"),
		}),
		gen.FieldRelate(field.BelongsTo, "UpdatedBy", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"updated_by_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("UpdatedBy"),
		}),
	)

	// Role owners
	roleOwners := g.GenerateModelAs(
		model("role_owners"),
		"RoleOwners",
		gen.FieldType("id", "uint"),
		gen.FieldType("role_id", "uint"),
		gen.FieldType("owner_id", "uint"),
		gen.FieldType("assigned_by_id", "uint"),
		gen.FieldRelate(field.BelongsTo, "Role", roles, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"role_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Role"),
		}),
		gen.FieldRelate(field.BelongsTo, "Owner", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"owner_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Owner"),
		}),
		gen.FieldRelate(field.BelongsTo, "AssignedBy", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"assigned_by_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("AssignedBy"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
	)

	// User sessions
	userSessions := g.GenerateModelAs(
		model("user_sessions"),
		"UserSessions",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("is_active", "bool"),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
	)

	// Revoked tokens
	revokedTokens := g.GenerateModelAs(
		model("revoked_tokens"),
		"RevokedTokens",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
	)

	// Encryption keys
	encryptionKeys := g.GenerateModelAs(
		model("encryption_keys"),
		"EncryptionKeys",
		gen.FieldType("id", "uint"),
		gen.FieldType("key_version", "int"),
		gen.FieldType("is_active", "bool"),
		gen.FieldIgnore("encrypted_key"),
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
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),

		gen.FieldRelate(field.BelongsTo, "MaslowLevel", maslowLevels, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"maslow_level_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("MaslowLevel"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
		gen.FieldRelate(field.BelongsTo, "Value", coreValues, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"value_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Value"),
		}),
	)

	// ============================================================================
	// CONSCIOUSNESS LEVELS (David Hawkins)
	// ============================================================================

	// Consciousness levels
	// consciousnessLevels := g.GenerateModelAs(
	// 	model("consciousness_levels"),
	// 	"ConsciousnessLevels",
	// 	gen.FieldType("id", "int"),
	// 	gen.FieldType("level_score", "int"),
	// 	gen.FieldType("sort_order", "int"),
	// )

	// User consciousness tracking
	// userConsciousnessTracking := g.GenerateModelAs(
	// 	model("user_consciousness_tracking"),
	// 	"UserConsciousnessTracking",
	// 	gen.FieldType("id", "uint"),
	// 	gen.FieldType("user_id", "uint"),
	// 	gen.FieldType("consciousness_score", "int"),
	// 	gen.FieldType("primary_level_id", "int"),
	// 	gen.FieldType("source_id", "uint"),
	// 	gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
	// 		RelatePointer: true,
	// 		GORMTag: field.GormTag{
	// 			"foreignKey": []string{"user_id"},
	// 			"references": []string{"id"},
	// 		},
	// 		JSONTag: tag("User"),
	// 	}),
	// 	gen.FieldRelate(field.BelongsTo, "PrimaryLevel", consciousnessLevels, &field.RelateConfig{
	// 		RelatePointer: true,
	// 		GORMTag: field.GormTag{
	// 			"foreignKey": []string{"primary_level_id"},
	// 			"references": []string{"id"},
	// 		},
	// 		JSONTag: tag("PrimaryLevel"),
	// 	}),
	// )

	// ============================================================================
	// PLUTCHIK'S EMOTION WHEEL
	// ============================================================================

	// Plutchik emotions
	plutchikEmotions := g.GenerateModelAs(
		model("plutchik_emotions"),
		"PlutchikEmotions",
		gen.FieldType("id", "int"),
		gen.FieldType("category_id", "int"),
		gen.FieldType("intensity_level", "int"),
		gen.FieldType("base_emotion_id", "int"),
		gen.FieldType("name_mn", "string"),
		gen.FieldType("name_en", "string"),
		gen.FieldType("emoji", "string"),
		gen.FieldType("color", "string"),
	)

	// Plutchik combinations
	plutchikCombinations := g.GenerateModelAs(
		model("plutchik_combinations"),
		"PlutchikCombinations",
		gen.FieldType("id", "int"),
		gen.FieldType("emotion1_id", "int"),
		gen.FieldType("emotion2_id", "int"),
		gen.FieldRelate(field.BelongsTo, "Emotion1", plutchikEmotions, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"emotion1_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Emotion1"),
		}),
		gen.FieldRelate(field.BelongsTo, "Emotion2", plutchikEmotions, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"emotion2_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Emotion2"),
		}),
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
		gen.FieldType("is_private", "bool"),

		gen.FieldType("related_value_ids", "*uint"),
		gen.FieldType("ai_detected_values", "*string"),
		gen.FieldType("encryption_key_id", "*uint"),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
		// gen.FieldJSONTagWithNS(func(columnName string) string {
		// 	switch columnName {
		// 	case "content_encrypted", "encryption_key_id":
		// 		return `-`
		// 	default:
		// 		return columnName
		// 	}
		// }),
	)

	// ============================================================================
	// MOOD TRACKING
	// ============================================================================

	moodCategories := g.GenerateModelAs(
		model("mood_categories"),
		"MoodCategories",
		gen.FieldType("id", "int"),
		gen.FieldType("sort_order", "int"),
	)

	// Moods
	// moods := g.GenerateModelAs(
	// 	model("moods"),
	// 	"Moods",
	// 	gen.FieldType("id", "int"),
	// 	gen.FieldType("category_id", "int"),
	// 	gen.FieldType("intensity_level", "int"),
	// 	gen.FieldRelate(field.BelongsTo, "Category", moodCategories, &field.RelateConfig{
	// 		RelatePointer: true,
	// 		GORMTag: field.GormTag{
	// 			"foreignKey": []string{"category_id"},
	// 			"references": []string{"id"},
	// 		},
	// 		JSONTag: tag("Category"),
	// 	}),
	// )

	// Mood unit
	MoodUnit := g.GenerateModelAs(
		model("mood_unit"),
		"MoodUnit",
		gen.FieldType("id", "uint"),
		gen.FieldType("category_id", "uint"),
		gen.FieldType("plutchik_id", "uint"),
		gen.FieldType("combination_id", "uint"),
		gen.FieldType("display_name_mn", "string"),
		gen.FieldType("display_icon", "string"),

		gen.FieldRelate(field.BelongsTo, "MoodCategories", moodCategories, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"category_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("MoodCategories"),
		}),

		gen.FieldRelate(field.BelongsTo, "PlutchikEmotions", plutchikEmotions, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"plutchik_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("PlutchikEmotions"),
		}),

		gen.FieldRelate(field.BelongsTo, "PlutchikCombinations", plutchikCombinations, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"combination_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("PlutchikCombinations"),
		}),
	)

	// Mood entries
	moodEntries := g.GenerateModelAs(
		model("mood_entries"),
		"MoodEntries",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("mood_unit_id", "int"),
		// gen.FieldType("mood_id", "int"),
		// gen.FieldType("plutchik_id", "int"),
		gen.FieldType("intensity", "int"),
		gen.FieldType("trigger_event", "string"),
		gen.FieldType("ai_detected_values", "*[]uint"),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),

		gen.FieldRelate(field.BelongsTo, "CoreValues", coreValues, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"core_value_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("CoreValues"),
		}),

		gen.FieldRelate(field.BelongsTo, "MoodUnit", MoodUnit, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"mood_unit_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("MoodUnit"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
		gen.FieldRelate(field.BelongsTo, "MoodEntry", moodEntries, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"mood_entry_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("MoodEntry"),
		}),
		gen.FieldRelate(field.BelongsTo, "Journal", journals, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"journal_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Journal"),
		}),
		gen.FieldRelate(field.BelongsTo, "PlutchikEmotion", plutchikEmotions, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"plutchik_emotion_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("PlutchikEmotion"),
		}),
		gen.FieldRelate(field.BelongsTo, "DetectedCombination", plutchikCombinations, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"detected_combination_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("DetectedCombination"),
		}),
	)

	// ============================================================================
	// GOALS & MILESTONES
	// ============================================================================

	// GoalMilestones model
	goalMilestones := g.GenerateModelAs(
		model("goal_milestones"),
		"GoalMilestones",
		gen.FieldType("id", "uint"),
		gen.FieldType("goal_id", "uint"),
		gen.FieldType("is_completed", "bool"),
		gen.FieldType("sort_order", "int"),
		// gen.FieldRelate(field.BelongsTo, "Goal", model("goals"), &field.RelateConfig{
		// 	RelatePointer: true,
		// 	GORMTag: field.GormTag{
		// 		"foreignKey": []string{"goal_id"},
		// 		"references": []string{"id"},
		// 	},
		// 	JSONTag: tag("Goal"),
		// }),
	)

	// Goals model
	goals := g.GenerateModelAs(
		model("goals"),
		"Goals",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("value_id", "uint"),
		gen.FieldType("progress_percentage", "int"),
		gen.FieldType("is_public", "bool"),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),

		gen.FieldRelate(field.BelongsTo, "Value", coreValues, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"value_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Value"),
		}),

		// HasMany relation for milestones
		gen.FieldRelate(field.HasMany, "GoalMilestones", goalMilestones, &field.RelateConfig{
			RelateSlice: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"goal_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("GoalMilestones"),
		}),
	)

	// ============================================================================
	// LESSONS & LEARNING
	// ============================================================================

	// Lesson categories (basic definition first)
	lessonCategories := g.GenerateModelAs(
		model("lesson_categories"),
		"LessonCategory",

		gen.FieldType("id", "int"),
		gen.FieldType("parent_id", "*int"), // NULL зөв дэмжинэ
		gen.FieldType("sort_order", "int"),
		gen.FieldType("is_active", "bool"),
	)

	// Add self-referential relationships after the model is defined
	lessonCategories = g.GenerateModelAs(
		model("lesson_categories"),
		"LessonCategory",

		gen.FieldType("id", "int"),
		gen.FieldType("parent_id", "*int"), // NULL зөв дэмжинэ
		gen.FieldType("sort_order", "int"),
		gen.FieldType("is_active", "bool"),

		gen.FieldRelate(field.HasMany, "Children", lessonCategories, &field.RelateConfig{
			RelatePointer: false,
			GORMTag: field.GormTag{
				"foreignKey": []string{"parent_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("children"),
		}),
	)

	// Lessons
	lessons := g.GenerateModelAs(
		model("lessons"),
		"Lessons",
		gen.FieldType("id", "uint"),
		gen.FieldType("category_id", "int"),
		gen.FieldType("parent_id", "*uint"),
		gen.FieldType("required_level", "int"),
		gen.FieldType("estimated_duration", "int"),
		gen.FieldType("points_reward", "int"),
		gen.FieldType("is_premium", "bool"),
		gen.FieldType("is_published", "bool"),
		gen.FieldType("view_count", "int"),
		gen.FieldType("like_count", "int"),
		gen.FieldType("sort_order", "int"),
		gen.FieldType("related_value_keywords", "*string"),
		gen.FieldType("related_emotion_keywords", "*string"),
		gen.FieldIgnore("deleted_at"),
		gen.FieldRelate(field.BelongsTo, "Category", lessonCategories, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"category_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Category"),
		}),
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
		gen.FieldType("rating", "*int"),
		gen.FieldType("is_bookmarked", "bool"),

		gen.FieldRelate(field.BelongsTo, "Lesson", lessons, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"lesson_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Lesson"),
		}),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
		gen.FieldRelate(field.BelongsTo, "Lesson", lessons, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"lesson_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Lesson"),
		}),
		gen.FieldRelate(field.BelongsTo, "RelatedValue", coreValues, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"related_value_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("RelatedValue"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "Lesson", lessons, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"lesson_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Lesson"),
		}),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
	)

	// Lesson reactions
	lessonReactions := g.GenerateModelAs(
		model("lesson_reactions"),
		"LessonReactions",
		gen.FieldType("id", "uint"),
		gen.FieldType("lesson_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldRelate(field.BelongsTo, "Lesson", lessons, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"lesson_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Lesson"),
		}),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
		gen.FieldRelate(field.BelongsTo, "ProcessedBy", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"processed_by_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("ProcessedBy"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
		gen.FieldRelate(field.BelongsTo, "AccessedBy", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"accessed_by_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("AccessedBy"),
		}),
		gen.FieldRelate(field.BelongsTo, "Session", userSessions, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"session_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Session"),
		}),
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
		gen.FieldType("record_data", "datatypes.JSON"),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
		gen.FieldRelate(field.BelongsTo, "DeletedBy", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"deleted_by_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("DeletedBy"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "UpdatedBy", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"updated_by_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("UpdatedBy"),
		}),
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
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
	)

	// Error logs
	errorLogs := g.GenerateModelAs(
		model("error_logs"),
		"ErrorLogs",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("resolved_by_id", "uint"),
		gen.FieldType("is_resolved", "bool"),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
		gen.FieldRelate(field.BelongsTo, "ResolvedBy", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"resolved_by_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("ResolvedBy"),
		}),
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
		userLevels, scoringHistory, userGamification,

		// Maslow's Hierarchy & Core Values
		maslowLevels, coreValues, valueReflections,

		// Plutchik's Emotion Wheel
		plutchikEmotions, plutchikCombinations, userEmotionWheel,

		// Journals
		journals,

		// Mood Tracking
		moodCategories, MoodUnit, moodEntries,

		// Goals & Milestones
		goals, goalMilestones,

		// Lessons & Learning
		lessonCategories, lessons, userLessonProgress,
		lessonRecommendations, lessonComments, lessonReactions,

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
