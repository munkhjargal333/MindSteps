package repository

import (
	"mindsteps/database/model"
	"time"

	"gorm.io/gorm"
)

type CoreValueRepository interface {
	Create(value *model.CoreValues) error
	GetByID(id uint) (*model.CoreValues, error)
	Update(value *model.CoreValues) error
	Delete(id uint) error
	ListByUserID(userID uint) ([]model.CoreValues, error)
	CountByUserID(userID uint) (uint, error)
}

type coreValueRepo struct {
	db *gorm.DB
}

func NewCoreValueRepository(db *gorm.DB) CoreValueRepository {
	return &coreValueRepo{db: db}
}

func (r *coreValueRepo) Create(value *model.CoreValues) error {
	return r.db.Create(value).Error
}

func (r *coreValueRepo) GetByID(id uint) (*model.CoreValues, error) {
	var value model.CoreValues
	if err := r.db.Where("id = ? AND deleted_at IS NULL", id).First(&value).Error; err != nil {
		return nil, err
	}
	return &value, nil
}

func (r *coreValueRepo) Update(value *model.CoreValues) error {
	return r.db.Save(value).Error
}

func (r *coreValueRepo) Delete(id uint) error {
	now := time.Now()
	return r.db.Model(&model.CoreValues{}).Where("id = ?", id).Update("deleted_at", now).Error
}

func (r *coreValueRepo) ListByUserID(userID uint) ([]model.CoreValues, error) {
	var values []model.CoreValues
	if err := r.db.Where("user_id = ? AND deleted_at IS NULL", userID).
		Order("priority ASC").
		Find(&values).Error; err != nil {
		return nil, err
	}
	return values, nil
}

func (r *coreValueRepo) CountByUserID(userID uint) (uint, error) {
	var count int64
	if err := r.db.Model(&model.CoreValues{}).
		Where("user_id = ? AND deleted_at IS NULL", userID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return uint(count), nil
}
