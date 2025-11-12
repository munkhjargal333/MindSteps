package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type MoodRepository interface {
	Create(mood *model.Moods) error
	GetByID(id uint) (*model.Moods, error)
	Update(mood *model.Moods) error
	Delete(id uint) error
	List(limit int, offset int) ([]model.Moods, error)
	Count() (int64, error)
	ListByCategoryID(categoryID int) ([]model.PlutchikEmotions, error)
}

type moodRepo struct {
	db *gorm.DB
}

func NewMoodRepository(db *gorm.DB) MoodRepository {
	return &moodRepo{db: db}
}

func (r *moodRepo) Create(mood *model.Moods) error {
	return r.db.Create(mood).Error
}

func (r *moodRepo) GetByID(id uint) (*model.Moods, error) {
	var mood model.Moods
	if err := r.db.Where("id = ?", id).First(&mood).Error; err != nil {
		return nil, err
	}
	return &mood, nil
}

func (r *moodRepo) Update(mood *model.Moods) error {
	return r.db.Save(mood).Error
}

func (r *moodRepo) Delete(id uint) error {
	return r.db.Delete(&model.Moods{}, id).Error
}

func (r *moodRepo) List(limit int, offset int) ([]model.Moods, error) {
	var moods []model.Moods
	if err := r.db.
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&moods).Error; err != nil {
		return nil, err
	}
	return moods, nil
}

func (r *moodRepo) Count() (int64, error) {
	var count int64
	if err := r.db.Model(&model.Moods{}).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *moodRepo) ListByCategoryID(categoryID int) ([]model.PlutchikEmotions, error) {
	var moods []model.PlutchikEmotions
	if err := r.db.Where("category_id = ?", categoryID).
		Order("intensity_level DESC").
		Find(&moods).Error; err != nil {
		return nil, err
	}
	return moods, nil
}
