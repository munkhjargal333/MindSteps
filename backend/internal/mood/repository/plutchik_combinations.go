package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type PlutchikCombinationRepository interface {
	Create(combination *model.PlutchikCombinations) error
	GetByID(id int) (*model.PlutchikCombinations, error)
	Update(combination *model.PlutchikCombinations) error
	Delete(id int) error
	List(limit int, offset int) ([]model.PlutchikCombinations, error)
	ListAll() ([]model.PlutchikCombinations, error)
	Count() (int64, error)
	GetByEmotionPair(emotion1ID, emotion2ID int) (*model.PlutchikCombinations, error)
	ListByType(combinationType string) ([]model.PlutchikCombinations, error)
	EmotionList(limit int, offset int) ([]model.PlutchikEmotions, error)
}

type plutchikCombinationRepo struct {
	db *gorm.DB
}

func NewPlutchikCombinationRepository(db *gorm.DB) PlutchikCombinationRepository {
	return &plutchikCombinationRepo{db: db}
}

func (r *plutchikCombinationRepo) Create(combination *model.PlutchikCombinations) error {
	return r.db.Create(combination).Error
}

func (r *plutchikCombinationRepo) GetByID(id int) (*model.PlutchikCombinations, error) {
	var combination model.PlutchikCombinations
	if err := r.db.Where("id = ?", id).
		Preload("Emotion1").
		Preload("Emotion2").
		First(&combination).Error; err != nil {
		return nil, err
	}
	return &combination, nil
}

func (r *plutchikCombinationRepo) Update(combination *model.PlutchikCombinations) error {
	return r.db.Save(combination).Error
}

func (r *plutchikCombinationRepo) Delete(id int) error {
	// Check if any MoodUnit references this combination
	var count int64
	if err := r.db.Model(&model.MoodUnit{}).
		Where("combination_id = ?", id).
		Count(&count).Error; err != nil {
		return err
	}

	if count > 0 {
		return gorm.ErrRecordNotFound // or create custom error like "combination in use"
	}

	return r.db.Delete(&model.PlutchikCombinations{}, id).Error
}

func (r *plutchikCombinationRepo) List(limit int, offset int) ([]model.PlutchikCombinations, error) {
	var combinations []model.PlutchikCombinations
	if err := r.db.
		Preload("Emotion1").
		Preload("Emotion2").
		Order("id ASC").
		// Limit(limit).
		// Offset(offset).
		Find(&combinations).Error; err != nil {
		return nil, err
	}
	return combinations, nil
}

func (r *plutchikCombinationRepo) EmotionList(limit int, offset int) ([]model.PlutchikEmotions, error) {
	var combinations []model.PlutchikEmotions
	if err := r.db.
		Order("id ASC").
		// Limit(limit).
		// Offset(offset).
		Find(&combinations).Error; err != nil {
		return nil, err
	}
	return combinations, nil
}

func (r *plutchikCombinationRepo) ListAll() ([]model.PlutchikCombinations, error) {
	var combinations []model.PlutchikCombinations
	if err := r.db.
		Preload("Emotion1").
		Preload("Emotion2").
		Order("id ASC").
		Find(&combinations).Error; err != nil {
		return nil, err
	}
	return combinations, nil
}

func (r *plutchikCombinationRepo) Count() (int64, error) {
	var count int64
	if err := r.db.Model(&model.PlutchikCombinations{}).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *plutchikCombinationRepo) GetByEmotionPair(emotion1ID, emotion2ID int) (*model.PlutchikCombinations, error) {
	var combination model.PlutchikCombinations
	if err := r.db.Where("(emotion1_id = ? AND emotion2_id = ?) OR (emotion1_id = ? AND emotion2_id = ?)",
		emotion1ID, emotion2ID, emotion2ID, emotion1ID).
		Preload("Emotion1").
		Preload("Emotion2").
		First(&combination).Error; err != nil {
		return nil, err
	}
	return &combination, nil
}

func (r *plutchikCombinationRepo) ListByType(combinationType string) ([]model.PlutchikCombinations, error) {
	var combinations []model.PlutchikCombinations
	if err := r.db.Where("combination_type = ?", combinationType).
		Preload("Emotion1").
		Preload("Emotion2").
		Order("id ASC").
		Find(&combinations).Error; err != nil {
		return nil, err
	}
	return combinations, nil
}
