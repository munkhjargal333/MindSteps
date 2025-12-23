// ============================================
// service/lesson.go - Service Layer
// ============================================
package service

import (
	"mindsteps/database/model"
	"mindsteps/internal/lesson/form"
	"mindsteps/internal/lesson/repository"
	"strings"
	"time"
)

type LessonService interface {
	GetLessonByID(id uint) (*model.Lessons, error)
	GetAllLessons() ([]model.Lessons, error)
	GetAllLessonsByCategory(categoryID uint) ([]model.Lessons, error)
	GetAllCategory() ([]model.LessonCategory, error)
	CreateLesson(f form.LessonForm) (*model.Lessons, error)
	UpdateLesson(id uint, f form.LessonForm) (*model.Lessons, error)
	DeleteLesson(id uint) error
}

type lessonService struct {
	repo repository.LessonRepository
}

func NewLessonService(repo repository.LessonRepository) LessonService {
	return &lessonService{repo: repo}
}

func (s *lessonService) GetLessonByID(id uint) (*model.Lessons, error) {
	return s.repo.FindByID(id)
}

func (s *lessonService) GetAllLessons() ([]model.Lessons, error) {
	return s.repo.FindAll()
}

func (s *lessonService) GetAllLessonsByCategory(categoryID uint) ([]model.Lessons, error) {
	return s.repo.FindByCategoryID(categoryID)
}

func (s *lessonService) GetAllCategory() ([]model.LessonCategory, error) {
	return s.repo.CategoriesList()
}

func (s *lessonService) CreateLesson(f form.LessonForm) (*model.Lessons, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	// Generate slug if empty
	slug := f.Slug
	if slug == "" {
		slug = generateSlug(f.Title)
	}

	lesson := &model.Lessons{
		CategoryID:        int(f.CategoryID),
		ParentID:          f.ParentID,
		Title:             f.Title,
		Slug:              slug,
		Description:       f.Description,
		Content:           f.Content,
		LessonType:        f.LessonType,
		DifficultyLevel:   f.DifficultyLevel,
		RequiredLevel:     f.RequiredLevel,
		EstimatedDuration: f.EstimatedDuration,
		PointsReward:      f.PointsReward,
		MediaURL:          f.MediaURL,
		ThumbnailURL:      f.ThumbnailURL,
		Tags:              f.Tags,
		// RelatedValueKeywords:   &f.RelatedValueKeywords,
		// RelatedEmotionKeywords: &f.RelatedEmotionKeywords,
		IsPremium:   f.IsPremium,
		IsPublished: f.IsPublished,
		ViewCount:   0,
		LikeCount:   0,
		SortOrder:   f.SortOrder,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if f.IsPublished {
		lesson.PublishedAt = time.Now()
	}

	if err := s.repo.Create(lesson); err != nil {
		return nil, err
	}

	return lesson, nil
}

func (s *lessonService) UpdateLesson(id uint, f form.LessonForm) (*model.Lessons, error) {
	lesson, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields
	lesson.Title = f.Title
	lesson.CategoryID = int(f.CategoryID)

	if f.Slug != "" {
		lesson.Slug = f.Slug
	}

	lesson.ParentID = f.ParentID
	lesson.Description = f.Description
	lesson.Content = f.Content
	lesson.LessonType = f.LessonType
	lesson.DifficultyLevel = f.DifficultyLevel
	lesson.RequiredLevel = f.RequiredLevel
	lesson.EstimatedDuration = f.EstimatedDuration
	lesson.PointsReward = f.PointsReward
	lesson.MediaURL = f.MediaURL
	lesson.ThumbnailURL = f.ThumbnailURL
	lesson.Tags = f.Tags
	lesson.RelatedValueKeywords = &f.RelatedValueKeywords
	lesson.RelatedEmotionKeywords = &f.RelatedEmotionKeywords
	lesson.IsPremium = f.IsPremium
	lesson.SortOrder = f.SortOrder

	// Handle publish state change
	if f.IsPublished && !lesson.IsPublished {
		lesson.PublishedAt = time.Now()
	}
	lesson.IsPublished = f.IsPublished

	lesson.UpdatedAt = time.Now()

	if err := s.repo.Update(lesson); err != nil {
		return nil, err
	}

	return lesson, nil
}

func (s *lessonService) DeleteLesson(id uint) error {
	return s.repo.Delete(id)
}

// Helper function to generate slug
func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	// Remove special characters (keep only alphanumeric and hyphens)
	var result strings.Builder
	for _, r := range slug {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			result.WriteRune(r)
		}
	}
	return result.String()
}
