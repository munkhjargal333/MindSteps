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
	MaslowLevelList() ([]model.MaslowLevels, error)
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
	// if err := f.Validate(); err != nil {
	// 	return nil, err
	// }

	value, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	fmt.Println(f)
	// Update fields
	value.Name = f.Name
	value.Description = f.Description
	value.MaslowLevelID = *f.MaslowLevelID
	value.Color = f.Color
	value.PriorityOrder = f.PriorityOrder
	//value.IsActive = f.IsActive
	value.UpdatedAt = time.Now()

	fmt.Println(value)
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
func (s *coreValueService) MaslowLevelList() ([]model.MaslowLevels, error) {
	return s.repo.MaslowLevelList()
}
