package form

import (
	"fmt"
)

type LessonForm struct {
	CategoryID             uint   `json:"category_id" validate:"required"`
	ParentID               *uint  `json:"parent_id"`
	Title                  string `json:"title" validate:"required,min=1,max=255"`
	Slug                   string `json:"slug"`
	Description            string `json:"description"`
	Content                string `json:"content"`
	LessonType             string `json:"lesson_type"`
	DifficultyLevel        string `json:"difficulty_level"`
	RequiredLevel          int    `json:"required_level"`
	EstimatedDuration      int    `json:"estimated_duration"`
	PointsReward           int    `json:"points_reward"`
	MediaURL               string `json:"media_url"`
	ThumbnailURL           string `json:"thumbnail_url"`
	Tags                   string `json:"tags"`
	RelatedValueKeywords   string `json:"related_value_keywords"`
	RelatedEmotionKeywords string `json:"related_emotion_keywords"`
	IsPremium              bool   `json:"is_premium"`
	IsPublished            bool   `json:"is_published"`
	SortOrder              int    `json:"sort_order"`
}

func (f LessonForm) Validate() error {
	if f.Title == "" {
		return fmt.Errorf("title хоосон байна")
	}
	if len(f.Title) > 255 {
		return fmt.Errorf("title 255 тэмдэгтээс урт байж болохгүй")
	}
	if f.CategoryID == 0 {
		return fmt.Errorf("category_id шаардлагатай")
	}

	// Validate lesson type
	validTypes := map[string]bool{
		"article": true, "video": true, "audio": true,
		"interactive": true, "meditation": true,
	}
	if f.LessonType != "" && !validTypes[f.LessonType] {
		return fmt.Errorf("буруу lesson_type")
	}

	// Validate difficulty level
	validLevels := map[string]bool{
		"beginner": true, "intermediate": true, "advanced": true,
	}
	if f.DifficultyLevel != "" && !validLevels[f.DifficultyLevel] {
		return fmt.Errorf("буруу difficulty_level")
	}

	return nil
}
