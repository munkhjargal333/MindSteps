package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type JournalRepository interface {
	Create(journal *model.Journals) error
	GetByID(id uint) (*model.Journals, error)
	Update(journal *model.Journals) error
	Delete(id uint) error
	ListAll() ([]model.Journals, error)
	ListByUserID(userID uint) ([]model.Journals, error)
}

type journalRepo struct {
	db *gorm.DB
}

// Глобал DB-тай холбоогүй, гаднаас авна

func NewJournalRepository(db *gorm.DB) JournalRepository {
	return &journalRepo{db: db}
}

func (r *journalRepo) Create(journal *model.Journals) error {
	return r.db.Create(journal).Error
}

func (r *journalRepo) GetByID(id uint) (*model.Journals, error) {
	var journal model.Journals
	if err := r.db.First(&journal, id).Error; err != nil {
		return nil, err
	}
	return &journal, nil
}

func (r *journalRepo) Update(journal *model.Journals) error {
	return r.db.Save(journal).Error
}

func (r *journalRepo) Delete(id uint) error {
	return r.db.Delete(&model.Journals{}, id).Error
}

func (r *journalRepo) ListAll() ([]model.Journals, error) {
	var journals []model.Journals
	if err := r.db.Find(&journals).Error; err != nil {
		return nil, err
	}
	return journals, nil
}

func (r *journalRepo) ListByUserID(userID uint) ([]model.Journals, error) {
	var journals []model.Journals
	if err := r.db.Where("user_id = ?", userID).Find(&journals).Error; err != nil {
		return nil, err
	}
	return journals, nil
}
