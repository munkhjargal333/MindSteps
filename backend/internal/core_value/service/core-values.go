package service

import (
	"fmt"
	"mindsteps/database/model"
	"mindsteps/internal/core_value/form"
	"mindsteps/internal/core_value/repository"
	"time"
)

type CoreValueService interface {
	Create(form *form.CoreValueForm) (*model.CoreValues, error)
	GetByID(id uint) (*model.CoreValues, error)
	Update(id uint, form *form.CoreValueForm) (*model.CoreValues, error)
	Delete(id uint) error
	ListByUserID(userID uint) ([]model.CoreValues, error)
}

type coreValueService struct {
	repo repository.CoreValueRepository
}

func NewCoreValueService(repo repository.CoreValueRepository) CoreValueService {
	return &coreValueService{repo: repo}
}

func (s *coreValueService) Create(f *form.CoreValueForm) (*model.CoreValues, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	// Check if user already has 7 core values
	count, err := s.repo.CountByUserID(f.UserID)
	if err != nil {
		return nil, err
	}
	if count >= 7 {
		return nil, fmt.Errorf("хэрэглэгч дээд тал нь 7 үнэт зүйлтэй байж болно")
	}

	value := form.NewCoreValueFromForm(*f)
	value.CreatedAt = time.Now()
	value.UpdatedAt = time.Now()

	if err := s.repo.Create(value); err != nil {
		return nil, err
	}
	return value, nil
}

func (s *coreValueService) GetByID(id uint) (*model.CoreValues, error) {
	return s.repo.GetByID(id)
}

func (s *coreValueService) Update(id uint, f *form.CoreValueForm) (*model.CoreValues, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	value, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields
	value.Name = f.Name
	value.Description = f.Description
	value.MaslowLevelID = *f.MaslowLevelID
	value.Color = f.Color
	value.PriorityOrder = f.PriorityOrder
	value.IsActive = f.IsActive
	value.UpdatedAt = time.Now()

	if err := s.repo.Update(value); err != nil {
		return nil, err
	}
	return value, nil
}

func (s *coreValueService) Delete(id uint) error {
	return s.repo.Delete(id)
}

func (s *coreValueService) ListByUserID(userID uint) ([]model.CoreValues, error) {
	return s.repo.ListByUserID(userID)
}
