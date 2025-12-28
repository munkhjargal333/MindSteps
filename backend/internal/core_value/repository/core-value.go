package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type CoreValueRepository interface {
	Create(value *model.CoreValues) error
	GetByID(id uint) (*model.CoreValues, error)
	Update(value *model.CoreValues) error
	Delete(id uint) error
	ListByUserID(userID uint) ([]model.CoreValues, error)
	CountByUserID(userID uint) (uint, error)
	MaslowLevelList() ([]model.MaslowLevels, error)
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
	if err := r.db.Where("id = ? AND is_active = true ", id).First(&value).Error; err != nil {
		return nil, err
	}
	return &value, nil
}

func (r *coreValueRepo) Update(value *model.CoreValues) error {
	return r.db.Save(value).Error
}

func (r *coreValueRepo) Delete(id uint) error {
	// now := time.Now()
	return r.db.Model(&model.CoreValues{}).Where("id = ?", id).Update("is_active", false).Error
}

func (r *coreValueRepo) ListByUserID(userID uint) ([]model.CoreValues, error) {
	var values []model.CoreValues
	if err := r.db.Where("user_id = ? AND is_active IS true", userID).
		Order("maslow_level_id desc").
		Preload("MaslowLevel").
		Find(&values).Error; err != nil {
		return nil, err
	}
	return values, nil
}

func (r *coreValueRepo) CountByUserID(userID uint) (uint, error) {
	var count int64
	if err := r.db.Model(&model.CoreValues{}).
		Where("user_id = ?", userID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return uint(count), nil
}

func (r *coreValueRepo) MaslowLevelList() ([]model.MaslowLevels, error) {
	var res []model.MaslowLevels

	err := r.db.Order("sort_order desc").Find(&res).Error
	if err != nil {
		return nil, err
	}
	return res, nil
}
