package repository

import (
	"mindsteps/database/model"
	"time"

	"gorm.io/gorm"
)

type MoodEntryRepository interface {
	Create(entry *model.MoodEntries) error
	GetByID(id uint) (*model.MoodEntries, error)
	Update(entry *model.MoodEntries) error
	Delete(id uint) error
	ListByUserID(userID uint, limit int, offset int) ([]model.MoodEntries, error)
	CountByUserID(userID uint) (int64, error)
	FindByDateRange(userID uint, fromDate, toDate time.Time) ([]model.MoodEntries, error)
	ListByMoodID() ([]model.MoodCategories, error)
}

type moodEntryRepo struct {
	db *gorm.DB
}

func NewMoodEntryRepository(db *gorm.DB) MoodEntryRepository {
	return &moodEntryRepo{db: db}
}

func (r *moodEntryRepo) Create(entry *model.MoodEntries) error {
	return r.db.Create(entry).Error
}

func (r *moodEntryRepo) GetByID(id uint) (*model.MoodEntries, error) {
	var entry model.MoodEntries
	if err := r.db.Where("id = ?", id).
		Preload("Mood").
		First(&entry).Error; err != nil {
		return nil, err
	}
	return &entry, nil
}

func (r *moodEntryRepo) Update(entry *model.MoodEntries) error {
	return r.db.Save(entry).Error
}

func (r *moodEntryRepo) Delete(id uint) error {
	return r.db.Delete(&model.MoodEntries{}, id).Error
}

func (r *moodEntryRepo) ListByUserID(userID uint, limit int, offset int) ([]model.MoodEntries, error) {
	var entries []model.MoodEntries
	if err := r.db.Where("user_id = ?", userID).
		Preload("Mood").
		Order("entry_date DESC, created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&entries).Error; err != nil {
		return nil, err
	}
	return entries, nil
}

func (r *moodEntryRepo) ListByMoodID() ([]model.MoodCategories, error) {
	var categories []model.MoodCategories
	err := r.db.Find(&categories).Error

	if err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *moodEntryRepo) CountByUserID(userID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&model.MoodEntries{}).
		Where("user_id = ?", userID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *moodEntryRepo) FindByDateRange(userID uint, fromDate, toDate time.Time) ([]model.MoodEntries, error) {
	var entries []model.MoodEntries
	if err := r.db.Where("user_id = ? AND entry_date BETWEEN ? AND ?",
		userID, fromDate, toDate).
		Preload("Mood").
		Order("entry_date ASC").
		Find(&entries).Error; err != nil {
		return nil, err
	}
	return entries, nil
}
