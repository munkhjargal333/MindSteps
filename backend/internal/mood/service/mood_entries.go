package service

import (
	"mindsteps/database/model"
	"mindsteps/internal/mood/form"
	"mindsteps/internal/mood/repository"
	"time"
)

type MoodEntryService interface {
	Create(form *form.MoodEntryForm) (*model.MoodEntries, error)
	GetByID(id uint) (*model.MoodEntries, error)
	Update(id uint, form *form.MoodEntryForm) (*model.MoodEntries, error)
	Delete(id uint) error
	ListByUserID(userID uint, page, limit int) ([]model.MoodEntries, int64, error)
	GetStatistics(userID uint, days int) (map[string]interface{}, error)
	ListByMoodID() ([]model.MoodCategories, error)
}

type moodEntryService struct {
	repo repository.MoodEntryRepository
}

func NewMoodEntryService(repo repository.MoodEntryRepository) MoodEntryService {
	return &moodEntryService{repo: repo}
}

func (s *moodEntryService) ListByMoodID() ([]model.MoodCategories, error) {
	return s.repo.ListByMoodID()
}

func (s *moodEntryService) Create(f *form.MoodEntryForm) (*model.MoodEntries, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	entry := form.NewMoodEntryFromForm(*f)
	entry.CreatedAt = time.Now()
	//entry.UpdatedAt = time.Now()

	if err := s.repo.Create(entry); err != nil {
		return nil, err
	}

	return entry, nil
}

func (s *moodEntryService) GetByID(id uint) (*model.MoodEntries, error) {
	return s.repo.GetByID(id)
}

func (s *moodEntryService) Update(id uint, f *form.MoodEntryForm) (*model.MoodEntries, error) {
	// if err := f.Validate(); err != nil {
	// 	return nil, err
	// }

	entry, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	//entry.MoodID = f.MoodID
	entry.Intensity = f.Intensity
	entry.WhenFelt = f.WhenFelt
	entry.TriggerEvent = f.TriggerEvent
	entry.CopingStrategy = f.CopingStrategy
	entry.Notes = f.Notes
	entry.Location = f.Location
	entry.Weather = f.Weather
	//entry.RelatedValueIds = f.RelatedValueIds
	entry.UpdatedAt = time.Now()

	if err := s.repo.Update(entry); err != nil {
		return nil, err
	}
	return entry, nil
}

func (s *moodEntryService) Delete(id uint) error {
	return s.repo.Delete(id)
}

func (s *moodEntryService) ListByUserID(userID uint, page, limit int) ([]model.MoodEntries, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	entries, err := s.repo.ListByUserID(userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.repo.CountByUserID(userID)
	if err != nil {
		return nil, 0, err
	}

	return entries, total, nil
}

func (s *moodEntryService) GetStatistics(userID uint, days int) (map[string]interface{}, error) {
	toDate := time.Now()
	fromDate := toDate.AddDate(0, 0, -days)

	entries, err := s.repo.FindByDateRange(userID, fromDate, toDate)
	if err != nil {
		return nil, err
	}

	// Calculate statistics
	stats := make(map[string]interface{})
	stats["total_entries"] = len(entries)
	stats["period_days"] = days

	if len(entries) > 0 {
		totalIntensity := 0
		moodCounts := make(map[int]int)

		for _, entry := range entries {
			totalIntensity += entry.Intensity
			moodCounts[entry.MoodUnitID]++
		}

		stats["average_intensity"] = float64(totalIntensity) / float64(len(entries))
		stats["mood_distribution"] = moodCounts
	}

	return stats, nil
}
