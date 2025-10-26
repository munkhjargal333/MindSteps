package form

import (
	"fmt"
	"mindsteps/database/model"
)

type LessonForm struct {
	Title           string `json:"title" validate:"required,min=1,max=255"`
	CategoryID      uint   `json:"category_id" validate:"required"`
	Description     string `json:"description"`
	Content         string `json:"content"`
	LessonType      string `json:"lesson_type"`
	DifficultyLevel string `json:"difficulty_level"`
	IsPremium       bool   `json:"is_premium"`
	IsPublished     bool   `json:"is_published"`
	Tags            string `json:"tags"`
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
	return nil
}

func NewLessonFromForm(f LessonForm) *model.Lessons {
	return &model.Lessons{
		Title:           f.Title,
		CategoryID:      f.CategoryID,
		Description:     f.Description,
		Content:         f.Content,
		LessonType:      f.LessonType,
		DifficultyLevel: f.DifficultyLevel,
		IsPremium:       f.IsPremium,
		IsPublished:     f.IsPublished,
		Tags:            f.Tags,
	}
}
