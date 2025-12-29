// ============================================
// service/lesson.go - Service Layer
// ============================================
package service

import (
	"mindsteps/database/model"
	gamification "mindsteps/internal/gamification/service"
	"mindsteps/internal/lesson/form"
	"mindsteps/internal/lesson/repository"
	"strings"
	"time"
)

type LessonService interface {
	GetLessonByID(id uint) (*model.Lessons, error)
	GetAllLessons(page, limit int) ([]model.Lessons, int64, error)
	GetLessonsByParent(parentID uint, page, limit int) ([]model.Lessons, int64, error)
	GetLessonsByCategory(categoryID uint, page, limit int) ([]model.Lessons, int64, error)
	GetAllCategory() ([]model.LessonCategory, error)
	CreateLesson(f form.LessonForm) (*model.Lessons, error)
	UpdateLesson(id uint, f form.LessonForm) (*model.Lessons, error)
	DeleteLesson(id uint) error
	CompleteLesson(userID uint, f *form.CompleteLessonForm) error
}

type lessonService struct {
	repo         repository.LessonRepository
	gamification gamification.GamificationService
}

func NewLessonService(repo repository.LessonRepository, gamification gamification.GamificationService) LessonService {
	return &lessonService{repo: repo, gamification: gamification}
}

func (s *lessonService) GetLessonByID(id uint) (*model.Lessons, error) {
	return s.repo.FindByID(id)
}

// 1. Бүх хичээлийг авах (Шүүлтүүргүй үед)
func (s *lessonService) GetAllLessons(page, limit int) ([]model.Lessons, int64, error) {
	// Repo-гоос дата болон нийт тоог авна
	lessons, count, err := s.repo.FindAll(page, limit)
	if err != nil {
		return nil, 0, err
	}
	return lessons, count, nil
}

// 2. Үндсэн бүлгээр (Parent) шүүж авах
func (s *lessonService) GetLessonsByParent(parentID uint, page, limit int) ([]model.Lessons, int64, error) {
	// Үндсэн ангиллын ID-гаар шүүх
	lessons, count, err := s.repo.FindByParentCategoryID(parentID, page, limit)
	if err != nil {
		return nil, 0, err
	}
	return lessons, count, nil
}

// 3. Дэд бүлгээр (Category) шүүж авах
func (s *lessonService) GetLessonsByCategory(categoryID uint, page, limit int) ([]model.Lessons, int64, error) {
	// Тодорхой нэг дэд ангиллын ID-гаар шүүх
	lessons, count, err := s.repo.FindByCategoryID(categoryID, page, limit)
	if err != nil {
		return nil, 0, err
	}
	return lessons, count, nil
}

func (s *lessonService) CompleteLesson(userID uint, f *form.CompleteLessonForm) error {
	// 2. Өмнөх прогрессийг шалгах
	existingProgress, err := s.repo.GetProgress(userID, f.LessonID)

	// Өмнө нь энэ хичээлийг бүрэн дуусгаж байсан эсэхийг тодорхойлох туг (flag)
	alreadyCompleted := false
	if err == nil && existingProgress != nil && existingProgress.ProgressPercentage == 100 {
		alreadyCompleted = true
	}

	// Дата бэлдэх
	progress := &model.UserLessonProgress{
		UserID:             userID,
		LessonID:           f.LessonID,
		ProgressPercentage: 100,
		TimeSpent:          f.TimeSpent,
	}

	// Rating & Comment logic (Урьдын адил)
	if f.Rating != nil {
		progress.Rating = f.Rating
	} else if existingProgress != nil {
		progress.Rating = existingProgress.Rating
	}

	if f.Comment != "" {
		progress.ReviewText = f.Comment
	} else if existingProgress != nil {
		progress.ReviewText = existingProgress.ReviewText
	}

	// 3. Прогресс хадгалах
	if err := s.repo.UpsertProgress(progress); err != nil {
		return err
	}

	// 4. XP НЭМЭХ ХЭСЭГ (Зөвхөн анх удаа дуусгаж байгаа бол)
	if !alreadyCompleted {
		return s.gamification.AddXP(
			userID,
			f.PointsReward,
			"lesson_complete",
			f.LessonID,
			f.Comment,
		)
	}

	// Хэрэв аль хэдийн дуусгасан бол оноо нэмэхгүйгээр амжилттай буцаана
	return nil
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
