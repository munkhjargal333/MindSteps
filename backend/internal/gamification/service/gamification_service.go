package service

import (
	"mindsteps/database/model"
	"mindsteps/internal/gamification/repository"
	"time"
)

type GamificationService interface {
	GetUserGamification(userID uint) (*model.UserGamification, error)
	AddXP(userID uint, points int, source_type string, sourceID uint, metadata string) error
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
