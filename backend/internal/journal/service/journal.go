package service

import (
	"fmt"
	"mindsteps/database/model"
	"mindsteps/internal/journal/form"
	"mindsteps/internal/journal/repository"
	"time"
)

type JournalService interface {
	Create(form *form.JournalForm) (*model.Journals, error)
	GetByID(id uint) (*model.Journals, error)
	Update(id uint, form *form.JournalForm) (*model.Journals, error)
	Delete(id uint) error
	ListByUserID(userID uint, page, limit int) ([]model.Journals, uint, error)
}

type journalService struct {
	repo repository.JournalRepository
}

func NewJournalService(repo repository.JournalRepository) JournalService {
	return &journalService{repo: repo}
}

func (s *journalService) Create(f *form.JournalForm) (*model.Journals, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	journal := form.NewJournalFromForm(*f)

	journal.CreatedAt = time.Now()
	//journal.WordCount = journal.

	if err := s.repo.Create(journal); err != nil {
		return nil, err
	}
	return journal, nil
}

func (s *journalService) GetByID(id uint) (*model.Journals, error) {
	return s.repo.GetByID(id)
}

func (s *journalService) Update(id uint, f *form.JournalForm) (*model.Journals, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	journal, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields

	journal.Title = f.Title
	journal.Content = f.Content
	journal.IsPrivate = f.IsPrivate
	journal.Tags = f.Tags

	if err := s.repo.Update(journal); err != nil {
		return nil, err
	}
	return journal, nil
}

func (s *journalService) Delete(id uint) error {
	return s.repo.Delete(id)
}

func (s *journalService) ListByUserID(userID uint, page, limit int) ([]model.Journals, uint, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	journals, err := s.repo.ListByUserID(userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	fmt.Println("journals:", journals) // Debugging line

	total, err := s.repo.CountByUserID(userID)
	if err != nil {
		return nil, 0, err
	}

	return journals, total, nil
}
