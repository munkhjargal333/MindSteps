package repository

import (
	"mindsteps/database/model"
	"time"

	"gorm.io/gorm"
)

type GoalRepository interface {
	Create(goal *model.Goals) error
	GetByID(id uint) (*model.Goals, error)
	Update(goal *model.Goals) error
	Delete(id uint) error
	ListByUserID(userID uint) ([]model.Goals, error)
	CreateMilestone(milestone *model.GoalMilestones) error
	GetMilestoneByID(id uint) (*model.GoalMilestones, error)
	UpdateMilestone(milestone *model.GoalMilestones) error
	ListMilestonesByGoalID(goalID uint) ([]model.GoalMilestones, error)
}

type goalRepo struct {
	db *gorm.DB
}

func NewGoalRepository(db *gorm.DB) GoalRepository {
	return &goalRepo{db: db}
}

func (r *goalRepo) Create(goal *model.Goals) error {
	return r.db.Create(goal).Error
}

func (r *goalRepo) GetByID(id uint) (*model.Goals, error) {
	var goal model.Goals
	if err := r.db.Where("id = ? AND deleted_at IS NULL", id).
		Preload("Milestones", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		First(&goal).Error; err != nil {
		return nil, err
	}
	return &goal, nil
}

func (r *goalRepo) Update(goal *model.Goals) error {
	return r.db.Save(goal).Error
}

func (r *goalRepo) Delete(id uint) error {
	now := time.Now()
	return r.db.Model(&model.Goals{}).Where("id = ?", id).Update("deleted_at", now).Error
}

func (r *goalRepo) ListByUserID(userID uint) ([]model.Goals, error) {
	var goals []model.Goals
	if err := r.db.Where("user_id = ? AND deleted_at IS NULL", userID).
		Preload("Milestones", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Order("created_at DESC").
		Find(&goals).Error; err != nil {
		return nil, err
	}
	return goals, nil
}

func (r *goalRepo) CreateMilestone(milestone *model.GoalMilestones) error {
	return r.db.Create(milestone).Error
}

func (r *goalRepo) GetMilestoneByID(id uint) (*model.GoalMilestones, error) {
	var milestone model.GoalMilestones
	if err := r.db.Where("id = ?", id).First(&milestone).Error; err != nil {
		return nil, err
	}
	return &milestone, nil
}

func (r *goalRepo) UpdateMilestone(milestone *model.GoalMilestones) error {
	return r.db.Save(milestone).Error
}

func (r *goalRepo) ListMilestonesByGoalID(goalID uint) ([]model.GoalMilestones, error) {
	var milestones []model.GoalMilestones
	if err := r.db.Where("goal_id = ?", goalID).
		Order("sort_order ASC").
		Find(&milestones).Error; err != nil {
		return nil, err
	}
	return milestones, nil
}
