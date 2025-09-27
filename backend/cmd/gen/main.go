package main

import (
	"fmt"
	"mindsteps/config"
	"mindsteps/database"

	"gorm.io/gen"
	"gorm.io/gen/field"
	"gorm.io/gorm/logger"
)

// func omit(columnName string) string {
// 	return fmt.Sprintf("%s,omitempty", columnName)
// }

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

	// Users table
	users := g.GenerateModelAs(
		"users",
		"Users",
		gen.FieldType("id", "uint"),
		gen.FieldType("total_score", "int"),
		gen.FieldType("current_level", "int"),
		gen.FieldType("level_progress", "int"),
		gen.FieldType("is_active", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "name":
				return tag("name")
			case "email":
				return tag("email")
			case "password":
				return tag("password")
			case "total_score":
				return tag("total_score")
			case "current_level":
				return tag("current_level")
			case "level_progress":
				return tag("level_progress")
			case "profile_picture":
				return tag("profile_picture")
			case "timezone":
				return tag("timezone")
			case "is_active":
				return tag("is_active")
			case "last_login":
				return tag("last_login")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			default:
				return "-"
			}
		}),
	)

	authOTP := g.GenerateModelAs(
		"auth_otp",
		"AuthOTP",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("message_id", "uint"),
		gen.FieldType("otp", "string"),
		gen.FieldType("expired_at", "time.Time"),
		gen.FieldType("created_at", "time.Time"),
		gen.FieldType("deleted_at", "gorm.DeletedAt"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "message_id":
				return tag("message_id")
			case "otp":
				return tag("otp")
			case "expired_at":
				return tag("expired_at")
			case "created_at":
				return tag("created_at")
			case "deleted_at":
				return tag("deleted_at")
			default:
				return "-"
			}
		}),
		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	roles := g.GenerateModelAs(
		"roles",
		"Roles",

		gen.FieldType("id", "uint"),
		gen.FieldType("created_by_id", "uint"),
		gen.FieldType("updated_by_id", "uint"),
		gen.FieldType("permissions", "datatypes.JSON"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "code":
				return tag("code")
			case "name":
				return tag("name")
			case "permissions":
				return tag("permissions")
			case "level":
				return tag("level")
			case "created_by_id":
				return tag("created_by_id")
			case "updated_by_id":
				return tag("updated_by_id")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			default:
				return "-"
			}
		}),

		// gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
		// 	RelatePointer: true,
		// 	GORMTag: field.GormTag{
		// 		"foreignKey": []string{"updated_by_id"},
		// 		"references": []string{"id"},
		// 	},
		// 	JSONTag: tag("user"),
		// }),
	)

	roleOwners := g.GenerateModelAs(
		"role_owners",

		"RoleOwners",
		gen.FieldType("id", "uint"),
		gen.FieldType("role_id", "uint"),
		gen.FieldType("owner_id", "uint"),
		gen.FieldType("created_by_id", "uint"),
		gen.FieldType("updated_by_id", "uint"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "role_id":
				return tag("role_id")
			case "owner_id":
				return tag("owner_id")
			case "type":
				return tag("type")
			case "status":
				return tag("status")
			case "created_by_id":
				return tag("created_by_id")
			case "created_at":
				return tag("created_at")
			case "deleted_at":
				return tag("deleted_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.HasOne, "Role", roles, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"role_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("Role"),
		}),

		gen.FieldRelate(field.HasOne, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"owner_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("User"),
		}),
	)

	// User Levels table
	userLevels := g.GenerateModelAs(
		"user_levels",
		"UserLevels",
		gen.FieldType("id", "uint"),
		gen.FieldType("level_number", "int"),
		gen.FieldType("min_score", "int"),
		gen.FieldType("max_score", "int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "level_number":
				return tag("level_number")
			case "level_name":
				return tag("level_name")
			case "min_score":
				return tag("min_score")
			case "max_score":
				return tag("max_score")
			case "description":
				return tag("description")
			case "icon":
				return tag("icon")
			case "color":
				return tag("color")
			case "badge_image":
				return tag("badge_image")
			case "perks":
				return tag("perks")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),
	)

	// User Achievements table
	userAchievements := g.GenerateModelAs(
		"user_achievements",
		"UserAchievements",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("points_earned", "int"),
		gen.FieldType("is_featured", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "achievement_type":
				return tag("achievement_type")
			case "title":
				return tag("title")
			case "description":
				return tag("description")
			case "badge_icon":
				return tag("badge_icon")
			case "points_earned":
				return tag("points_earned")
			case "unlocked_at":
				return tag("unlocked_at")
			case "is_featured":
				return tag("is_featured")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// User Streaks table
	userStreaks := g.GenerateModelAs(
		"user_streaks",
		"UserStreaks",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("current_streak", "int"),
		gen.FieldType("longest_streak", "int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "streak_type":
				return tag("streak_type")
			case "current_streak":
				return tag("current_streak")
			case "longest_streak":
				return tag("longest_streak")
			case "last_activity_date":
				return tag("last_activity_date")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// Journals table
	journals := g.GenerateModelAs(
		"journals",
		"Journals",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("word_count", "*int"),
		gen.FieldType("sentiment_score", "*float64"),
		gen.FieldType("is_private", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "title":
				return tag("title")
			case "entry_date":
				return tag("entry_date")
			case "content":
				return tag("content")
			case "word_count":
				return tag("word_count")
			case "sentiment_score":
				return tag("sentiment_score")
			case "is_private":
				return tag("is_private")
			case "tags":
				return tag("tags")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// Mood Categories table
	moodCategories := g.GenerateModelAs(
		"mood_categories",
		"MoodCategories",
		gen.FieldType("id", "uint"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "name":
				return tag("name")
			case "color":
				return tag("color")
			case "icon":
				return tag("icon")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),
	)

	// Moods table
	moods := g.GenerateModelAs(
		"moods",
		"Moods",
		gen.FieldType("id", "uint"),
		gen.FieldType("category_id", "uint"),
		gen.FieldType("intensity_level", "*int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "category_id":
				return tag("category_id")
			case "name":
				return tag("name")
			case "description":
				return tag("description")
			case "intensity_level":
				return tag("intensity_level")
			case "emoji":
				return tag("emoji")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "Category", moodCategories, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"category_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("category"),
		}),
	)

	// Mood Entries table
	moodEntries := g.GenerateModelAs(
		"mood_entries",
		"MoodEntries",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("mood_id", "uint"),
		gen.FieldType("intensity", "*int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "entry_date":
				return tag("entry_date")
			case "mood_id":
				return tag("mood_id")
			case "intensity":
				return tag("intensity")
			case "when_felt":
				return tag("when_felt")
			case "trigger_event":
				return tag("trigger_event")
			case "coping_strategy":
				return tag("coping_strategy")
			case "notes":
				return tag("notes")
			case "location":
				return tag("location")
			case "weather":
				return tag("weather")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),

		gen.FieldRelate(field.BelongsTo, "Mood", moods, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"mood_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("mood"),
		}),
	)

	// Core Values table
	coreValues := g.GenerateModelAs(
		"core_values",
		"CoreValues",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("priority_order", "*int"),
		gen.FieldType("is_active", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "name":
				return tag("name")
			case "description":
				return tag("description")
			case "priority_order":
				return tag("priority_order")
			case "color":
				return tag("color")
			case "is_active":
				return tag("is_active")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// Goals table
	goals := g.GenerateModelAs(
		"goals",
		"Goals",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("value_id", "*uint"),
		gen.FieldType("progress_percentage", "int"),
		gen.FieldType("is_public", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "value_id":
				return tag("value_id")
			case "title":
				return tag("title")
			case "description":
				return tag("description")
			case "goal_type":
				return tag("goal_type")
			case "target_date":
				return tag("target_date")
			case "status":
				return tag("status")
			case "progress_percentage":
				return tag("progress_percentage")
			case "is_public":
				return tag("is_public")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			case "completed_at":
				return tag("completed_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),

		gen.FieldRelate(field.BelongsTo, "Value", coreValues, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"value_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("value"),
		}),
	)

	// Goal Milestones table
	goalMilestones := g.GenerateModelAs(
		"goal_milestones",
		"GoalMilestones",
		gen.FieldType("id", "uint"),
		gen.FieldType("goal_id", "uint"),
		gen.FieldType("is_completed", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "goal_id":
				return tag("goal_id")
			case "title":
				return tag("title")
			case "description":
				return tag("description")
			case "target_date":
				return tag("target_date")
			case "is_completed":
				return tag("is_completed")
			case "completed_at":
				return tag("completed_at")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "Goal", goals, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"goal_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("goal"),
		}),
	)

	// Lesson Categories table
	lessonCategories := g.GenerateModelAs(
		"lesson_categories",
		"LessonCategories",
		gen.FieldType("id", "uint"),
		gen.FieldType("sort_order", "*int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "name":
				return tag("name")
			case "description":
				return tag("description")
			case "icon":
				return tag("icon")
			case "color":
				return tag("color")
			case "sort_order":
				return tag("sort_order")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),
	)

	// Lessons table
	lessons := g.GenerateModelAs(
		"lessons",
		"Lessons",
		gen.FieldType("id", "uint"),
		gen.FieldType("category_id", "uint"),
		gen.FieldType("parent_id", "*uint"),
		gen.FieldType("required_level", "int"),
		gen.FieldType("estimated_duration", "*int"),
		gen.FieldType("points_reward", "int"),
		gen.FieldType("is_premium", "bool"),
		gen.FieldType("is_published", "bool"),
		gen.FieldType("view_count", "int"),
		gen.FieldType("sort_order", "*int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "category_id":
				return tag("category_id")
			case "parent_id":
				return tag("parent_id")
			case "title":
				return tag("title")
			case "slug":
				return tag("slug")
			case "description":
				return tag("description")
			case "content":
				return tag("content")
			case "lesson_type":
				return tag("lesson_type")
			case "difficulty_level":
				return tag("difficulty_level")
			case "required_level":
				return tag("required_level")
			case "estimated_duration":
				return tag("estimated_duration")
			case "points_reward":
				return tag("points_reward")
			case "media_url":
				return tag("media_url")
			case "thumbnail_url":
				return tag("thumbnail_url")
			case "tags":
				return tag("tags")
			case "is_premium":
				return tag("is_premium")
			case "is_published":
				return tag("is_published")
			case "view_count":
				return tag("view_count")
			case "sort_order":
				return tag("sort_order")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			case "published_at":
				return tag("published_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "Category", lessonCategories, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"category_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("category"),
		}),

		// gen.FieldRelate(field.BelongsTo, "Parent", lessons, &field.RelateConfig{
		// 	RelatePointer: true,
		// 	GORMTag: field.GormTag{
		// 		"foreignKey": []string{"parent_id"},
		// 		"references": []string{"id"},
		// 	},
		// 	JSONTag: tag("parent"),
		// }),
	)

	// Lesson Comments table
	lessonComments := g.GenerateModelAs(
		"lesson_comments",
		"LessonComments",
		gen.FieldType("id", "uint"),
		gen.FieldType("lesson_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("parent_id", "*uint"),
		gen.FieldType("is_edited", "bool"),
		gen.FieldType("is_deleted", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "lesson_id":
				return tag("lesson_id")
			case "user_id":
				return tag("user_id")
			case "parent_id":
				return tag("parent_id")
			case "content":
				return tag("content")
			case "is_edited":
				return tag("is_edited")
			case "is_deleted":
				return tag("is_deleted")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "Lesson", lessons, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"lesson_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("lesson"),
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),

		// gen.FieldRelate(field.BelongsTo, "Parent", lessonComments, &field.RelateConfig{
		// 	RelatePointer: true,
		// 	GORMTag: field.GormTag{
		// 		"foreignKey": []string{"parent_id"},
		// 		"references": []string{"id"},
		// 	},
		// 	JSONTag: tag("parent"),
		// }),
	)

	// Lesson Reactions table
	lessonReactions := g.GenerateModelAs(
		"lesson_reactions",
		"LessonReactions",
		gen.FieldType("id", "uint"),
		gen.FieldType("lesson_id", "uint"),
		gen.FieldType("user_id", "uint"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "lesson_id":
				return tag("lesson_id")
			case "user_id":
				return tag("user_id")
			case "reaction_type":
				return tag("reaction_type")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "Lesson", lessons, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"lesson_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("lesson"),
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// User Lesson Progress table
	userLessonProgress := g.GenerateModelAs(
		"user_lesson_progress",
		"UserLessonProgress",
		gen.FieldType("id", "uint"),
		gen.FieldType("lesson_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("progress_percentage", "int"),
		gen.FieldType("time_spent", "int"),
		gen.FieldType("rating", "*int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "lesson_id":
				return tag("lesson_id")
			case "user_id":
				return tag("user_id")
			case "progress_percentage":
				return tag("progress_percentage")
			case "status":
				return tag("status")
			case "time_spent":
				return tag("time_spent")
			case "last_accessed":
				return tag("last_accessed")
			case "completion_date":
				return tag("completion_date")
			case "rating":
				return tag("rating")
			case "review_text":
				return tag("review_text")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "Lesson", lessons, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"lesson_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("lesson"),
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// Meditation Techniques table
	meditationTechniques := g.GenerateModelAs(
		"meditation_techniques",
		"MeditationTechniques",
		gen.FieldType("id", "uint"),
		gen.FieldType("recommended_duration", "*int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "name":
				return tag("name")
			case "description":
				return tag("description")
			case "instructions":
				return tag("instructions")
			case "difficulty_level":
				return tag("difficulty_level")
			case "recommended_duration":
				return tag("recommended_duration")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),
	)

	// Meditation Sessions table
	meditationSessions := g.GenerateModelAs(
		"meditation_sessions",
		"MeditationSessions",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("technique_id", "*uint"),
		gen.FieldType("duration_planned", "*int"),
		gen.FieldType("duration_actual", "*int"),
		gen.FieldType("quality_rating", "*int"),
		gen.FieldType("interruptions", "int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "technique_id":
				return tag("technique_id")
			case "session_date":
				return tag("session_date")
			case "start_time":
				return tag("start_time")
			case "duration_planned":
				return tag("duration_planned")
			case "duration_actual":
				return tag("duration_actual")
			case "quality_rating":
				return tag("quality_rating")
			case "mood_before":
				return tag("mood_before")
			case "mood_after":
				return tag("mood_after")
			case "notes":
				return tag("notes")
			case "interruptions":
				return tag("interruptions")
			case "environment":
				return tag("environment")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),

		gen.FieldRelate(field.BelongsTo, "Technique", meditationTechniques, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"technique_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("technique"),
		}),
	)

	// AI Scoring Criteria table
	aiScoringCriteria := g.GenerateModelAs(
		"ai_scoring_criteria",
		"AIScoringCriteria",
		gen.FieldType("id", "uint"),
		gen.FieldType("max_points", "int"),
		gen.FieldType("weight", "float64"),
		gen.FieldType("is_active", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "criteria_name":
				return tag("criteria_name")
			case "description":
				return tag("description")
			case "max_points":
				return tag("max_points")
			case "weight":
				return tag("weight")
			case "is_active":
				return tag("is_active")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),
	)

	// AI Journal Detailed Analysis table
	aiJournalDetailedAnalysis := g.GenerateModelAs(
		"ai_journal_detailed_analysis",
		"AIJournalDetailedAnalysis",
		gen.FieldType("id", "uint"),
		gen.FieldType("journal_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("overall_sentiment", "*float64"),
		gen.FieldType("emotion_intensity", "*float64"),
		gen.FieldType("emotional_depth_score", "*int"),
		gen.FieldType("self_reflection_score", "*int"),
		gen.FieldType("goal_alignment_score", "*int"),
		gen.FieldType("gratitude_score", "*int"),
		gen.FieldType("problem_solving_score", "*int"),
		gen.FieldType("mindfulness_score", "*int"),
		gen.FieldType("total_weighted_score", "*float64"),
		gen.FieldType("bonus_points", "int"),
		gen.FieldType("final_points", "*int"),
		gen.FieldType("ai_confidence", "*float64"),
		gen.FieldType("processing_duration", "*int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "journal_id":
				return tag("journal_id")
			case "user_id":
				return tag("user_id")
			case "overall_sentiment":
				return tag("overall_sentiment")
			case "primary_emotions":
				return tag("primary_emotions")
			case "emotion_intensity":
				return tag("emotion_intensity")
			case "emotional_depth_score":
				return tag("emotional_depth_score")
			case "self_reflection_score":
				return tag("self_reflection_score")
			case "goal_alignment_score":
				return tag("goal_alignment_score")
			case "gratitude_score":
				return tag("gratitude_score")
			case "problem_solving_score":
				return tag("problem_solving_score")
			case "mindfulness_score":
				return tag("mindfulness_score")
			case "stress_indicators":
				return tag("stress_indicators")
			case "positive_patterns":
				return tag("positive_patterns")
			case "concerning_patterns":
				return tag("concerning_patterns")
			case "growth_indicators":
				return tag("growth_indicators")
			case "personalized_feedback":
				return tag("personalized_feedback")
			case "suggested_actions":
				return tag("suggested_actions")
			case "recommended_lessons":
				return tag("recommended_lessons")
			case "total_weighted_score":
				return tag("total_weighted_score")
			case "bonus_points":
				return tag("bonus_points")
			case "final_points":
				return tag("final_points")
			case "ai_confidence":
				return tag("ai_confidence")
			case "processing_version":
				return tag("processing_version")
			case "processing_duration":
				return tag("processing_duration")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "Journal", journals, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"journal_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("journal"),
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// AI Mood Analysis table
	aiMoodAnalysis := g.GenerateModelAs(
		"ai_mood_analysis",
		"AIMoodAnalysis",
		gen.FieldType("id", "uint"),
		gen.FieldType("mood_entry_id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("mood_consistency_score", "*int"),
		gen.FieldType("trigger_pattern_score", "*int"),
		gen.FieldType("coping_effectiveness_score", "*int"),
		gen.FieldType("emotional_intelligence_score", "*int"),
		gen.FieldType("points_earned", "int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "mood_entry_id":
				return tag("mood_entry_id")
			case "user_id":
				return tag("user_id")
			case "mood_consistency_score":
				return tag("mood_consistency_score")
			case "trigger_pattern_score":
				return tag("trigger_pattern_score")
			case "coping_effectiveness_score":
				return tag("coping_effectiveness_score")
			case "emotional_intelligence_score":
				return tag("emotional_intelligence_score")
			case "detected_patterns":
				return tag("detected_patterns")
			case "improvement_suggestions":
				return tag("improvement_suggestions")
			case "warning_flags":
				return tag("warning_flags")
			case "points_earned":
				return tag("points_earned")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "MoodEntry", moodEntries, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"mood_entry_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("mood_entry"),
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// AI Progress Tracking table
	aiProgressTracking := g.GenerateModelAs(
		"ai_progress_tracking",
		"AIProgressTracking",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("journal_consistency_score", "*int"),
		gen.FieldType("mood_stability_trend", "*float64"),
		gen.FieldType("goal_progress_rate", "*float64"),
		gen.FieldType("meditation_regularity_score", "*int"),
		gen.FieldType("overall_wellbeing_trend", "*float64"),
		gen.FieldType("period_total_points", "*int"),
		gen.FieldType("improvement_bonus_points", "int"),
		gen.FieldType("consistency_bonus_points", "int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "analysis_period":
				return tag("analysis_period")
			case "period_start":
				return tag("period_start")
			case "period_end":
				return tag("period_end")
			case "journal_consistency_score":
				return tag("journal_consistency_score")
			case "mood_stability_trend":
				return tag("mood_stability_trend")
			case "goal_progress_rate":
				return tag("goal_progress_rate")
			case "meditation_regularity_score":
				return tag("meditation_regularity_score")
			case "overall_wellbeing_trend":
				return tag("overall_wellbeing_trend")
			case "key_improvements":
				return tag("key_improvements")
			case "areas_needing_attention":
				return tag("areas_needing_attention")
			case "behavioral_changes_detected":
				return tag("behavioral_changes_detected")
			case "recommended_focus_areas":
				return tag("recommended_focus_areas")
			case "period_total_points":
				return tag("period_total_points")
			case "improvement_bonus_points":
				return tag("improvement_bonus_points")
			case "consistency_bonus_points":
				return tag("consistency_bonus_points")
			case "generated_at":
				return tag("generated_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// Scoring History table
	scoringHistory := g.GenerateModelAs(
		"scoring_history",
		"ScoringHistory",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("source_id", "*int"),
		gen.FieldType("points_earned", "int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "source_type":
				return tag("source_type")
			case "source_id":
				return tag("source_id")
			case "points_earned":
				return tag("points_earned")
			case "points_type":
				return tag("points_type")
			case "description":
				return tag("description")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// User Insights table
	userInsights := g.GenerateModelAs(
		"user_insights",
		"UserInsights",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("is_read", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "insight_type":
				return tag("insight_type")
			case "title":
				return tag("title")
			case "description":
				return tag("description")
			case "data_points":
				return tag("data_points")
			case "period_start":
				return tag("period_start")
			case "period_end":
				return tag("period_end")
			case "is_read":
				return tag("is_read")
			case "priority":
				return tag("priority")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// Progress Reports table
	progressReports := g.GenerateModelAs(
		"progress_reports",
		"ProgressReports",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("overall_wellbeing_score", "*int"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "report_type":
				return tag("report_type")
			case "period_start":
				return tag("period_start")
			case "period_end":
				return tag("period_end")
			case "overall_wellbeing_score":
				return tag("overall_wellbeing_score")
			case "mood_summary":
				return tag("mood_summary")
			case "journal_insights":
				return tag("journal_insights")
			case "goal_progress":
				return tag("goal_progress")
			case "meditation_summary":
				return tag("meditation_summary")
			case "key_achievements":
				return tag("key_achievements")
			case "areas_for_improvement":
				return tag("areas_for_improvement")
			case "personalized_recommendations":
				return tag("personalized_recommendations")
			case "generated_at":
				return tag("generated_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// User Preferences table
	userPreferences := g.GenerateModelAs(
		"user_preferences",
		"UserPreferences",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("reminder_journal", "bool"),
		gen.FieldType("reminder_mood_check", "bool"),
		gen.FieldType("reminder_meditation", "bool"),
		gen.FieldType("notification_email", "bool"),
		gen.FieldType("notification_push", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "reminder_journal":
				return tag("reminder_journal")
			case "reminder_mood_check":
				return tag("reminder_mood_check")
			case "reminder_meditation":
				return tag("reminder_meditation")
			case "reminder_time":
				return tag("reminder_time")
			case "notification_email":
				return tag("notification_email")
			case "notification_push":
				return tag("notification_push")
			case "privacy_level":
				return tag("privacy_level")
			case "theme":
				return tag("theme")
			case "language":
				return tag("language")
			case "created_at":
				return tag("created_at")
			case "updated_at":
				return tag("updated_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// Notifications table
	notifications := g.GenerateModelAs(
		"notifications",
		"Notifications",
		gen.FieldType("id", "uint"),
		gen.FieldType("user_id", "uint"),
		gen.FieldType("is_read", "bool"),

		gen.FieldJSONTagWithNS(func(columnName string) string {
			switch columnName {
			case "id":
				return tag("id")
			case "user_id":
				return tag("user_id")
			case "title":
				return tag("title")
			case "message":
				return tag("message")
			case "notification_type":
				return tag("notification_type")
			case "is_read":
				return tag("is_read")
			case "action_url":
				return tag("action_url")
			case "scheduled_for":
				return tag("scheduled_for")
			case "sent_at":
				return tag("sent_at")
			case "created_at":
				return tag("created_at")
			default:
				return "-"
			}
		}),

		gen.FieldRelate(field.BelongsTo, "User", users, &field.RelateConfig{
			RelatePointer: true,
			GORMTag: field.GormTag{
				"foreignKey": []string{"user_id"},
				"references": []string{"id"},
			},
			JSONTag: tag("user"),
		}),
	)

	// Apply all models to the generator
	g.ApplyBasic(
		users,
		userLevels,
		userAchievements,
		userStreaks,
		journals,
		moodCategories,
		moods,
		moodEntries,
		coreValues,
		goals,
		goalMilestones,
		lessonCategories,
		lessons,
		lessonComments,
		lessonReactions,
		userLessonProgress,
		meditationTechniques,
		meditationSessions,
		aiScoringCriteria,
		aiJournalDetailedAnalysis,
		aiMoodAnalysis,
		aiProgressTracking,
		scoringHistory,
		userInsights,
		progressReports,
		userPreferences,
		notifications,

		authOTP,
		roles,
		roleOwners,
	)

	// Execute the generation
	g.Execute()
}
