package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type GamificationRepository interface {
	GetByUserID(userID uint) (*model.UserGamification, error)
	UpdateProgress(stats *model.UserGamification) error
	CreateScoreHistory(history *model.ScoringHistory) error
	GetLevelByScore(score int) (*model.UserLevels, error)
}

type gamificationRepo struct {
	db *gorm.DB
}

func NewGamificationRepository(db *gorm.DB) GamificationRepository {
	return &gamificationRepo{db}
}

func (r *gamificationRepo) GetByUserID(userID uint) (*model.UserGamification, error) {
	var stats model.UserGamification

	// 1. Хэрэглэгчийн статистикийг хайна, байхгүй бол анхны утгатайгаар үүсгэнэ
	err := r.db.Preload("Level").
		Where(model.UserGamification{UserID: userID}).
		Attrs(model.UserGamification{
			TotalScore:     0,
			CurrentLevelID: 1, // Анхны түвшний ID
			CurrentStreak:  0,
		}).
		FirstOrCreate(&stats).Error

	return &stats, err
}

func (r *gamificationRepo) GetLevelByScore(score int) (*model.UserLevels, error) {
	var level model.UserLevels
	err := r.db.Where("min_score <= ? AND (max_score >= ? OR max_score IS NULL)", score, score).First(&level).Error
	return &level, err
}

func (r *gamificationRepo) UpdateProgress(stats *model.UserGamification) error {
	return r.db.Save(stats).Error
}

func (r *gamificationRepo) CreateScoreHistory(history *model.ScoringHistory) error {
	return r.db.Create(history).Error
}
