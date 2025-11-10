package form

import (
	"fmt"
	"mindsteps/database/model"
	"time"
)

type GoalForm struct {
	ValueID     *uint      `json:"value_id"`
	Title       string     `json:"title" validate:"required,min=3,max=255"`
	Description string     `json:"description"`
	GoalType    string     `json:"goal_type" validate:"required"`
	TargetDate  *time.Time `json:"target_date"`
	Priority    string     `json:"priority" validate:"required,oneof=low medium high"`
	IsPublic    bool       `json:"is_public"`
	UserID      uint       `json:"user_id"`
}

func (f GoalForm) Validate() error {
	if f.Title == "" {
		return fmt.Errorf("title хоосон байна")
	}
	if len(f.Title) < 3 || len(f.Title) > 255 {
		return fmt.Errorf("title 3-255 тэмдэгт байх ёстой")
	}
	if f.GoalType == "" {
		return fmt.Errorf("goal_type хоосон байна")
	}
	validTypes := map[string]bool{"short_term": true, "long_term": true, "habit": true}
	if !validTypes[f.GoalType] {
		return fmt.Errorf("goal_type: short_term, long_term, habit-ийн аль нэг байх ёстой")
	}
	if f.Priority != "low" && f.Priority != "medium" && f.Priority != "high" {
		return fmt.Errorf("priority: low, medium, high-ийн аль нэг байх ёстой")
	}
	return nil
}

func NewGoalFromForm(f GoalForm) *model.Goals {
	return &model.Goals{
		UserID:             f.UserID,
		ValueID:            *f.ValueID,
		Title:              f.Title,
		Description:        f.Description,
		GoalType:           f.GoalType,
		TargetDate:         *f.TargetDate,
		Priority:           f.Priority,
		IsPublic:           f.IsPublic,
		Status:             "active",
		ProgressPercentage: 0,
	}
}
