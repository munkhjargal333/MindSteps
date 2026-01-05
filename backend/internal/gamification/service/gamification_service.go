package service

import (
	"fmt"
	"mindsteps/database/model"
	"mindsteps/internal/gamification/form"
	"mindsteps/internal/gamification/repository"
	"time"
)

type GamificationService interface {
	GetUserGamification(userID uint) (*model.UserGamification, error)
	AddXP(userID uint, points int, source_type string, sourceID uint, metadata string) error

	GetFullDashboardData(userID uint) (*form.UserDashboardResponse, error)
}

type gamificationService struct {
	repo repository.GamificationRepository
}

// Pointer буцаах
func NewGamificationService(repo repository.GamificationRepository) *gamificationService {
	return &gamificationService{repo: repo}
}

func (s *gamificationService) GetUserGamification(userID uint) (*model.UserGamification, error) {
	return s.repo.GetByUserID(userID)
}

func (s *gamificationService) AddXP(userID uint, points int, source_type string, sourceID uint, metadata string) error {
	stats, err := s.repo.GetByUserID(userID)
	if err != nil {
		return err
	}

	// --- Streak Logic Эхлэл ---
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	if !stats.LastActivityAt.IsZero() {
		lastActivityDay := time.Date(
			stats.LastActivityAt.Year(),
			stats.LastActivityAt.Month(),
			stats.LastActivityAt.Day(),
			0, 0, 0, 0, stats.LastActivityAt.Location(),
		)

		diff := today.Sub(lastActivityDay).Hours() / 24

		if diff == 1 {
			// Өчигдөр орсон байна, streak нэмнэ
			stats.CurrentStreak += 1
			if stats.CurrentStreak > stats.LongestStreak {
				stats.LongestStreak = stats.CurrentStreak
			}
		} else if diff > 1 {
			// 1-ээс олон хоног алгассан, reset 1
			stats.CurrentStreak = 1
		}
		// Хэрэв diff == 0 бол өнөөдөр аль хэдийн орсон тул streak-ийг хэвээр үлдээнэ
	} else {
		// Анхны идэвх
		stats.CurrentStreak = 1
		stats.LongestStreak = 1
	}
	stats.LastActivityAt = now
	// --- Streak Logic Төгсгөл ---

	// 2. Оноо нэмэх
	stats.TotalScore += points

	// 3. Түвшин шалгах
	newLevel, err := s.repo.GetLevelByScore(stats.TotalScore)
	if err == nil {
		stats.CurrentLevelID = newLevel.ID
		if newLevel.MaxScore > 0 {
			rangeScore := newLevel.MaxScore - newLevel.MinScore
			stats.LevelProgress = ((stats.TotalScore - newLevel.MinScore) * 100) / rangeScore
		}
	}

	fmt.Printf("UPDATE хийхийн өмнөх ID: %d, Шинэ Level ID: %d\n", stats.CurrentLevelID, newLevel.ID)

	// 4. Түүх болон Статус хадгалах
	history := &model.ScoringHistory{
		UserID:       userID,
		SourceType:   source_type,
		SourceID:     sourceID,
		PointsEarned: points,
		PointsType:   "activity",
	}

	if err := s.repo.CreateScoreHistory(history); err != nil {
		return err
	}

	return s.repo.UpdateProgress(stats)
}

func (s *gamificationService) GetFullDashboardData(userID uint) (*form.UserDashboardResponse, error) {
	var (
		dashboard = &form.UserDashboardResponse{}
		errChan   = make(chan error, 3) // 3 өөр параллель процесс ажиллуулна
	)

	// 1. Ерөнхий статистик (Journals, Moods Count)
	go func() {
		stats, err := s.repo.GetUserActivityStats(userID)
		if err != nil {
			errChan <- err
			return
		}
		dashboard.Stats = *stats
		errChan <- nil
	}()

	// 2. Хичээлийн явц (Parent Categories)
	go func() {
		lessons, err := s.repo.GetUserProgressByParentCategories(userID)
		if err != nil {
			errChan <- err
			return
		}
		dashboard.CategoryProgress = lessons
		errChan <- nil
	}()

	// 3. Плутчикийн нарийн статистик (Advanced Wheel Logic)
	// go func() {
	// 	plutchik, err := s.repo.GetPlutchikDashboardData(userID)
	// 	if err != nil {
	// 		errChan <- err
	// 		return
	// 	}
	// 	dashboard.PlutchikWheel = plutchik
	// 	errChan <- nil
	// }()

	// Бүх процесс дуусахыг хүлээх (Timeout эсвэл Error check)
	for i := 0; i < 2; i++ {
		if err := <-errChan; err != nil {
			return nil, err
		}
	}

	return dashboard, nil
}
