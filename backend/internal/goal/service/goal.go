package service

import (
	"mindsteps/database/model"
	"mindsteps/internal/goal/form"
	"mindsteps/internal/goal/repository"
	"time"
)

type GoalService interface {
	Create(form *form.GoalForm) (*model.Goals, error)
	GetByID(id uint) (*model.Goals, error)
	Update(id uint, form *form.GoalForm) (*model.Goals, error)
	Delete(id uint) error
	ListByUserID(userID uint) ([]model.Goals, error)
	CreateMilestone(goalID uint, form *form.MilestoneForm) (*model.GoalMilestones, error)
	UpdateMilestone(id uint, form *form.MilestoneForm) (*model.GoalMilestones, error)
	CompleteMilestone(id uint) (*model.GoalMilestones, error)
	UpdateGoalProgress(goalID uint) error
}

type goalService struct {
	repo repository.GoalRepository
}

func NewGoalService(repo repository.GoalRepository) GoalService {
	return &goalService{repo: repo}
}

func (s *goalService) Create(f *form.GoalForm) (*model.Goals, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	goal := form.NewGoalFromForm(*f)
	goal.CreatedAt = time.Now()
	goal.UpdatedAt = time.Now()

	if err := s.repo.Create(goal); err != nil {
		return nil, err
	}

	// TODO: Award points for creating goal (15 points)

	return goal, nil
}

func (s *goalService) GetByID(id uint) (*model.Goals, error) {
	return s.repo.GetByID(id)
}

func (s *goalService) Update(id uint, f *form.GoalForm) (*model.Goals, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	goal, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	goal.ValueID = *f.ValueID
	goal.Title = f.Title
	goal.Description = f.Description
	goal.GoalType = f.GoalType
	goal.TargetDate = *f.TargetDate
	goal.Priority = f.Priority
	goal.IsPublic = f.IsPublic
	goal.UpdatedAt = time.Now()

	if err := s.repo.Update(goal); err != nil {
		return nil, err
	}
	return goal, nil
}

func (s *goalService) Delete(id uint) error {
	return s.repo.Delete(id)
}

func (s *goalService) ListByUserID(userID uint) ([]model.Goals, error) {
	return s.repo.ListByUserID(userID)
}

func (s *goalService) CreateMilestone(goalID uint, f *form.MilestoneForm) (*model.GoalMilestones, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	// Check if goal exists
	goal, err := s.repo.GetByID(goalID)
	if err != nil {
		return nil, err
	}

	milestone := form.NewMilestoneFromForm(*f, goalID)
	milestone.CreatedAt = time.Now()

	if err := s.repo.CreateMilestone(milestone); err != nil {
		return nil, err
	}

	// Update goal progress after adding milestone
	s.UpdateGoalProgress(goal.ID)

	return milestone, nil
}

func (s *goalService) UpdateMilestone(id uint, f *form.MilestoneForm) (*model.GoalMilestones, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	milestone, err := s.repo.GetMilestoneByID(id)
	if err != nil {
		return nil, err
	}

	milestone.Title = f.Title
	milestone.Description = f.Description
	milestone.TargetDate = *f.TargetDate
	milestone.SortOrder = f.SortOrder

	if err := s.repo.UpdateMilestone(milestone); err != nil {
		return nil, err
	}
	return milestone, nil
}

func (s *goalService) CompleteMilestone(id uint) (*model.GoalMilestones, error) {
	milestone, err := s.repo.GetMilestoneByID(id)
	if err != nil {
		return nil, err
	}

	if milestone.IsCompleted {
		return milestone, nil // Already completed
	}

	now := time.Now()
	milestone.IsCompleted = true
	milestone.CompletedAt = now

	if err := s.repo.UpdateMilestone(milestone); err != nil {
		return nil, err
	}

	// Update goal progress
	if err := s.UpdateGoalProgress(milestone.GoalID); err != nil {
		return nil, err
	}

	// TODO: Award points for completing milestone

	return milestone, nil
}

func (s *goalService) UpdateGoalProgress(goalID uint) error {
	milestones, err := s.repo.ListMilestonesByGoalID(goalID)
	if err != nil {
		return err
	}

	goal, err := s.repo.GetByID(goalID)
	if err != nil {
		return err
	}

	if len(milestones) == 0 {
		goal.ProgressPercentage = 0
		goal.UpdatedAt = time.Now()
		return s.repo.Update(goal)
	}

	// Calculate progress
	completedCount := 0
	for _, m := range milestones {
		if m.IsCompleted {
			completedCount++
		}
	}

	goal.ProgressPercentage = (completedCount * 100) / len(milestones)

	// Check if goal is fully completed
	if goal.ProgressPercentage == 100 && goal.Status == "active" {
		now := time.Now()
		goal.Status = "completed"
		goal.CompletedAt = now

		// TODO: Award completion bonus points (50 points)
	}

	goal.UpdatedAt = time.Now()
	return s.repo.Update(goal)
}
