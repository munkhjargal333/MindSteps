package repository

import (
	"mindsteps/database/model"
	"time"

	"gorm.io/gorm"
)

type JournalRepository interface {
	Create(journal *model.Journals) error
	GetByID(id uint) (*model.Journals, error)
	Update(journal *model.Journals) error
	Delete(id uint) error
	ListByUserID(userID uint, limit int, offset int) ([]model.Journals, error)
	CountByUserID(userID uint) (uint, error)
	Search(userID uint, query string, tags []string, fromDate, toDate time.Time) ([]model.Journals, error)
	GetRecentByUserID(userID uint, days int) ([]model.Journals, error)
}

type journalRepo struct {
	db *gorm.DB
}

func NewJournalRepository(db *gorm.DB) JournalRepository {
	return &journalRepo{db: db}
}

func (r *journalRepo) Create(journal *model.Journals) error {
	return r.db.Create(journal).Error
}

func (r *journalRepo) GetByID(id uint) (*model.Journals, error) {
	var journal model.Journals
	if err := r.db.Where("id = ? AND deleted_at IS NULL", id).First(&journal).Error; err != nil {
		return nil, err
	}
	return &journal, nil
}

func (r *journalRepo) Update(journal *model.Journals) error {
	return r.db.Save(journal).Error
}

func (r *journalRepo) Delete(id uint) error {
	now := time.Now()
	return r.db.Model(&model.Journals{}).Where("id = ?", id).Update("deleted_at", now).Error
}

func (r *journalRepo) ListByUserID(userID uint, limit int, offset int) ([]model.Journals, error) {
	var journals []model.Journals
	if err := r.db.Where("user_id = ? AND deleted_at IS NULL", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&journals).Error; err != nil {
		return nil, err
	}
	return journals, nil
}

func (r *journalRepo) CountByUserID(userID uint) (uint, error) {
	var count int64
	if err := r.db.Model(&model.Journals{}).
		Where("user_id = ? AND deleted_at IS NULL", userID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return uint(count), nil
}

func (r *journalRepo) Search(userID uint, query string, tags []string, fromDate, toDate time.Time) ([]model.Journals, error) {
	var journals []model.Journals

	db := r.db.Where("user_id = ? AND deleted_at IS NULL", userID)

	if query != "" {
		db = db.Where("title ILIKE ? OR content ILIKE ?", "%"+query+"%", "%"+query+"%")
	}

	if len(tags) > 0 {
		db = db.Where("tags && ?", tags)
	}

	if !fromDate.IsZero() {
		db = db.Where("created_at >= ?", fromDate)
	}

	if !toDate.IsZero() {
		db = db.Where("created_at <= ?", toDate)
	}

	if err := db.Order("created_at DESC").Find(&journals).Error; err != nil {
		return nil, err
	}
	return journals, nil
}

func (r *journalRepo) GetRecentByUserID(userID uint, days int) ([]model.Journals, error) {
	var journals []model.Journals
	fromDate := time.Now().AddDate(0, 0, -days)

	if err := r.db.Where("user_id = ? AND deleted_at IS NULL AND created_at >= ?", userID, fromDate).
		Order("created_at DESC").
		Find(&journals).Error; err != nil {
		return nil, err
	}
	return journals, nil
}
