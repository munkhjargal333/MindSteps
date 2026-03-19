package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type MoodUnitRepository interface {
	GetByID(id uint) (*model.MoodUnit, error)
	List(limit int, offset int) ([]model.MoodUnit, error)
	Count() (int64, error)
	ListByCategoryID(categoryID uint) ([]model.MoodUnit, error)
	ListByType(moodType string) ([]model.MoodUnit, error)
}

type moodUnitRepo struct {
	db *gorm.DB
}

func NewMoodUnitRepository(db *gorm.DB) MoodUnitRepository {
	return &moodUnitRepo{db: db}
}

func (r *moodUnitRepo) GetByID(id uint) (*model.MoodUnit, error) {
	var moodUnit model.MoodUnit
	if err := r.db.Where("id = ?", id).
		Preload("MoodCategories").
		Preload("PlutchikEmotions").
		Preload("PlutchikCombinations").
		Preload("PlutchikCombinations.Emotion1").
		Preload("PlutchikCombinations.Emotion2").
		First(&moodUnit).Error; err != nil {
		return nil, err
	}
	return &moodUnit, nil
}

func (r *moodUnitRepo) List(limit int, offset int) ([]model.MoodUnit, error) {
	var moodUnits []model.MoodUnit
	if err := r.db.
		Preload("MoodCategories").
		Preload("PlutchikEmotions").
		Preload("PlutchikCombinations").
		Preload("PlutchikCombinations.Emotion1").
		Preload("PlutchikCombinations.Emotion2").
		Order("category_id ASC, id ASC").
		Limit(limit).
		Offset(offset).
		Find(&moodUnits).Error; err != nil {
		return nil, err
	}
	return moodUnits, nil
}

func (r *moodUnitRepo) Count() (int64, error) {
	var count int64
	if err := r.db.Model(&model.MoodUnit{}).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *moodUnitRepo) ListByCategoryID(categoryID uint) ([]model.MoodUnit, error) {
	var moodUnits []model.MoodUnit
	if err := r.db.Where("category_id = ?", categoryID).
		Where("type = ?", "dyad").
		Preload("MoodCategories").
		Preload("PlutchikEmotions").
		Preload("PlutchikCombinations").
		Preload("PlutchikCombinations.Emotion1").
		Preload("PlutchikCombinations.Emotion2").
		Order("id ASC").
		Find(&moodUnits).Error; err != nil {
		return nil, err
	}
	return moodUnits, nil
}

func (r *moodUnitRepo) ListByType(moodType string) ([]model.MoodUnit, error) {
	var moodUnits []model.MoodUnit
	if err := r.db.Where("type = ?", moodType).
		Preload("MoodCategories").
		Preload("PlutchikEmotions").
		Preload("PlutchikCombinations").
		Preload("PlutchikCombinations.Emotion1").
		Preload("PlutchikCombinations.Emotion2").
		Order("category_id ASC, id ASC").
		Find(&moodUnits).Error; err != nil {
		return nil, err
	}
	return moodUnits, nil
}
