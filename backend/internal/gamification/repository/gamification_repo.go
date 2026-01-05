package repository

import (
	"mindsteps/database/model"
	"mindsteps/internal/gamification/form"

	"gorm.io/gorm"
)

type GamificationRepository interface {
	GetByUserID(userID uint) (*model.UserGamification, error)
	UpdateProgress(stats *model.UserGamification) error
	CreateScoreHistory(history *model.ScoringHistory) error
	GetLevelByScore(score int) (*model.UserLevels, error)

	//dashboard
	GetUserProgressByParentCategories(userID uint) ([]form.CategoryProgress, error)
	GetUserActivityStats(userID uint) (*form.UserActivityStats, error)
	GetPlutchikDashboardData(userID uint) ([]form.PlutchikStat, error)
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
	err := r.db.
		Preload("Level").
		// Preload("User").
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
	return r.db.Omit("Level").Save(stats).Error
}

func (r *gamificationRepo) CreateScoreHistory(history *model.ScoringHistory) error {
	return r.db.Create(history).Error
}

func (r *gamificationRepo) GetUserProgressByParentCategories(userID uint) ([]form.CategoryProgress, error) {
	var results []form.CategoryProgress

	// SQL query:
	// 1. Үндсэн категорийг pc, дэд категорийг sc гэж холбоно.
	// 2. Status 'completed' эсвэл progress_percentage = 100-аар шүүнэ.
	query := `
        SELECT 
            pc.id as category_id, 
            pc.name_mn as category_name,
            pc.emoji as emoji,
            COUNT(l.id) as total_lessons,
            COUNT(ulp.id) FILTER (WHERE ulp.status = 'completed' OR ulp.progress_percentage = 100) as completed_lessons
        FROM mindstep.lesson_categories pc
        LEFT JOIN mindstep.lesson_categories sc ON sc.parent_id = pc.id
        LEFT JOIN mindstep.lessons l ON l.category_id = sc.id OR l.category_id = pc.id
        LEFT JOIN mindstep.user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = ?
        WHERE pc.parent_id IS NULL AND pc.is_active = true
        GROUP BY pc.id, pc.name_mn, pc.emoji, pc.sort_order
        ORDER BY pc.sort_order ASC
    `

	err := r.db.Raw(query, userID).Scan(&results).Error
	if err != nil {
		return nil, err
	}

	// Прогресс тооцоолол
	for i := range results {
		if results[i].TotalLessons > 0 {
			results[i].ProgressPercent = (float64(results[i].CompletedLessons) / float64(results[i].TotalLessons)) * 100
		}
	}

	return results, nil
}

func (r *gamificationRepo) GetUserActivityStats(userID uint) (*form.UserActivityStats, error) {
	var stats form.UserActivityStats

	// 1. Нийт бичсэн Journal-ын тоо
	err := r.db.Model(&model.Journals{}).
		Where("user_id = ?", userID).
		Count(&stats.TotalJournals).Error

	// 2. Нийт бүртгүүлсэн Mood-ын тоо
	err = r.db.Model(&model.MoodEntries{}).
		Where("user_id = ?", userID).
		Count(&stats.TotalMoods).Error
	if err != nil {
		return nil, err
	}

	// 3. Нийт үзэж дуусгасан хичээлийн тоо
	err = r.db.Model(&model.UserLessonProgress{}).
		Where("user_id = ? AND (status = 'completed' OR progress_percentage = 100)", userID).
		Count(&stats.TotalLessons).Error
	if err != nil {
		return nil, err
	}

	return &stats, nil
}

func (r *gamificationRepo) GetPlutchikDashboardData(userID uint) ([]form.PlutchikStat, error) {
	var stats []form.PlutchikStat

	query := `
    WITH user_data AS (
        -- Анхдагч болон холимог эмоциудыг нэгтгэж жинлэх (Weighting)
        SELECT mu.plutchik_id as eid, me.intensity, 1.0 as w FROM mindstep.mood_entries me 
        JOIN mindstep.mood_unit mu ON me.mood_unit_id = mu.id WHERE me.user_id = ? AND mu.plutchik_id IS NOT NULL
        UNION ALL
        SELECT pc.emotion1_id, me.intensity, 0.5 FROM mindstep.mood_entries me 
        JOIN mindstep.mood_unit mu ON me.mood_unit_id = mu.id 
        JOIN mindstep.plutchik_combinations pc ON mu.combination_id = pc.id WHERE me.user_id = ?
        UNION ALL
        SELECT pc.emotion2_id, me.intensity, 0.5 FROM mindstep.mood_entries me 
        JOIN mindstep.mood_unit mu ON me.mood_unit_id = mu.id 
        JOIN mindstep.plutchik_combinations pc ON mu.combination_id = pc.id WHERE me.user_id = ?
    )
    SELECT 
        be.id as emotion_id,
        be.name_mn as emotion_name_mn,
        be.color,
        be.emoji,
        COALESCE(SUM(ud.w), 0) as count,
        COALESCE(AVG(ud.intensity), 0) as avg_intensity
    FROM mindstep.plutchik_emotions be
    LEFT JOIN user_data ud ON be.id = ud.eid
    -- Энд танай үндсэн 8 эмоцийн ID-нууд орно (Жишээ нь 1-ээс 8)
    WHERE be.id <= 8 
    GROUP BY be.id, be.name_mn, be.color, be.emoji
    ORDER BY be.id ASC
    `
	err := r.db.Raw(query, userID, userID, userID).Scan(&stats).Error
	return stats, err
}
