package service

import (
	"mindsteps/database/model"
	"mindsteps/internal/mood/form"
	"mindsteps/internal/mood/repository"
)

type PlutchikCombinationService interface {
	GetByID(id int) (*model.PlutchikCombinations, error)
	Update(id int, form *form.PlutchikCombinationForm) (*model.PlutchikCombinations, error)
	List(page, limit int) ([]model.PlutchikCombinations, error)
	Delete(id int) error
	EmotionList(page, limit int) ([]model.PlutchikEmotions, error)
}

type plutchikCombinationService struct {
	repo repository.PlutchikCombinationRepository
}

func NewPlutchikCombinationService(repo repository.PlutchikCombinationRepository) PlutchikCombinationService {
	return &plutchikCombinationService{repo: repo}
}

func (s *plutchikCombinationService) GetByID(id int) (*model.PlutchikCombinations, error) {
	return s.repo.GetByID(id)
}

func (s *plutchikCombinationService) Delete(id int) error {
	// combination, err := s.repo.GetByID(id)
	// if err != nil {
	// 	return nil, err
	// }

	if err := s.repo.Delete(id); err != nil {
		return err
	}
	return nil
}

func (s *plutchikCombinationService) EmotionList(page, limit int) ([]model.PlutchikEmotions, error) {
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

	return s.repo.EmotionList(limit, offset)
}

func (s *plutchikCombinationService) Update(id int, f *form.PlutchikCombinationForm) (*model.PlutchikCombinations, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	combination, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	combination.CombinedNameEn = f.CombinedNameEn
	combination.CombinedNameMn = f.CombinedNameMn
	combination.CombinationType = f.CombinationType
	combination.Description = f.Description
	combination.Color = f.Color
	combination.Emoji = f.Emoji

	if err := s.repo.Update(combination); err != nil {
		return nil, err
	}

	// Reload with relations
	return s.repo.GetByID(id)
}

func (s *plutchikCombinationService) List(page, limit int) ([]model.PlutchikCombinations, error) {
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

	return s.repo.List(limit, offset)
}
