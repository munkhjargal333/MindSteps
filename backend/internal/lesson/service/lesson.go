package service

import (
	"mindsteps/database/model"
	"mindsteps/internal/lesson/form"
	"mindsteps/internal/lesson/repository"
)

type LessonService interface {
	CreateLesson(f form.LessonForm) (*model.Lessons, error)
	GetAllLessons() ([]model.Lessons, error)
	GetLessonByID(id uint) (*model.Lessons, error)
	UpdateLesson(id uint, f form.LessonForm) (*model.Lessons, error)
	DeleteLesson(id uint) error
}

type lessonService struct {
	repo repository.LessonRepository
}

func NewLessonService(repo repository.LessonRepository) LessonService {
	return &lessonService{repo: repo}
}

func (s *lessonService) CreateLesson(f form.LessonForm) (*model.Lessons, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}
	lesson := form.NewLessonFromForm(f)
	if err := s.repo.Create(lesson); err != nil {
		return nil, err
	}
	return lesson, nil
}

func (s *lessonService) GetAllLessons() ([]model.Lessons, error) {
	return s.repo.FindAll()
}

func (s *lessonService) GetLessonByID(id uint) (*model.Lessons, error) {
	return s.repo.FindByID(id)
}

func (s *lessonService) UpdateLesson(id uint, f form.LessonForm) (*model.Lessons, error) {
	lesson, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	lesson.Title = f.Title
	lesson.Description = f.Description
	lesson.Content = f.Content
	lesson.IsPremium = f.IsPremium
	lesson.IsPublished = f.IsPublished

	if err := s.repo.Update(lesson); err != nil {
		return nil, err
	}
	return lesson, nil
}

func (s *lessonService) DeleteLesson(id uint) error {
	return s.repo.Delete(id)
}
