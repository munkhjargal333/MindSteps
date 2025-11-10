package service

import (
	"mindsteps/database/model"
	"mindsteps/internal/mood/form"
	"mindsteps/internal/mood/repository"
	"time"
)

type MoodService interface {
	Create(form *form.MoodForm) (*model.Moods, error)
	GetByID(id uint) (*model.Moods, error)
	Update(id uint, form *form.MoodForm) (*model.Moods, error)
	Delete(id uint) error
	List(page, limit int) ([]model.Moods, int64, error)
	ListByCategoryID(categoryID int) ([]model.Moods, error)
}

type moodService struct {
	repo repository.MoodRepository
}

func NewMoodService(repo repository.MoodRepository) MoodService {
	return &moodService{repo: repo}
}

// Create new mood
func (s *moodService) Create(f *form.MoodForm) (*model.Moods, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	mood := form.NewMoodFromForm(*f)
	mood.CreatedAt = time.Now()
	//mood.UpdatedAt = time.Now()

	if err := s.repo.Create(mood); err != nil {
		return nil, err
	}

	return mood, nil
}

// Get mood by ID
func (s *moodService) GetByID(id uint) (*model.Moods, error) {
	return s.repo.GetByID(id)
}

// Update mood
func (s *moodService) Update(id uint, f *form.MoodForm) (*model.Moods, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	mood, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	//mood.Name = f.Name
	mood.Description = f.Description
	mood.IntensityLevel = f.IntensityLevel
	mood.CategoryID = f.CategoryID
	//mood.UpdatedAt = time.Now()

	if err := s.repo.Update(mood); err != nil {
		return nil, err
	}

	return mood, nil
}

// Delete mood by ID
func (s *moodService) Delete(id uint) error {
	return s.repo.Delete(id)
}

// List moods with pagination
func (s *moodService) List(page, limit int) ([]model.Moods, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	moods, err := s.repo.List(limit, offset)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.repo.Count()
	if err != nil {
		return nil, 0, err
	}

	return moods, total, nil
}

// List moods by category ID
func (s *moodService) ListByCategoryID(categoryID int) ([]model.Moods, error) {
	return s.repo.ListByCategoryID(categoryID)
}
