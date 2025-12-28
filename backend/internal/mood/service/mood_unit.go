package service

import (
	"mindsteps/database/model"
	"mindsteps/internal/mood/repository"
)

type MoodUnitService interface {
	GetByID(id uint) (*model.MoodUnit, error)
	List(page, limit int) ([]model.MoodUnit, int64, error)
	ListByCategoryID(categoryID uint) ([]model.MoodUnit, error)
	ListByType(moodType string) ([]model.MoodUnit, error)
}

type moodUnitService struct {
	repo repository.MoodUnitRepository
}

func NewMoodUnitService(repo repository.MoodUnitRepository) MoodUnitService {
	return &moodUnitService{repo: repo}
}

func (s *moodUnitService) GetByID(id uint) (*model.MoodUnit, error) {
	return s.repo.GetByID(id)
}

func (s *moodUnitService) List(page, limit int) ([]model.MoodUnit, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 100
	}
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	moodUnits, err := s.repo.List(limit, offset)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.repo.Count()
	if err != nil {
		return nil, 0, err
	}

	return moodUnits, total, nil
}

func (s *moodUnitService) ListByCategoryID(categoryID uint) ([]model.MoodUnit, error) {
	return s.repo.ListByCategoryID(categoryID)
}

func (s *moodUnitService) ListByType(moodType string) ([]model.MoodUnit, error) {
	return s.repo.ListByType(moodType)
}
