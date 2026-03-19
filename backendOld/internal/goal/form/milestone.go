package form

import (
	"fmt"
	"mindsteps/database/model"
	"time"
)

type MilestoneForm struct {
	Title       string     `json:"title" validate:"required,min=3,max=255"`
	Description string     `json:"description"`
	TargetDate  *time.Time `json:"target_date"`
	SortOrder   int        `json:"sort_order" validate:"required,min=1"`
}

func (f MilestoneForm) Validate() error {
	if f.Title == "" {
		return fmt.Errorf("title хоосон байна")
	}
	if len(f.Title) < 3 {
		return fmt.Errorf("title 3-аас дээш тэмдэгт байх ёстой")
	}
	if f.SortOrder < 1 {
		return fmt.Errorf("sort_order 1-ээс их байх ёстой")
	}
	return nil
}

func NewMilestoneFromForm(f MilestoneForm, goalID uint) *model.GoalMilestones {
	return &model.GoalMilestones{
		GoalID:      goalID,
		Title:       f.Title,
		Description: f.Description,
		TargetDate:  *f.TargetDate,
		SortOrder:   f.SortOrder,
		IsCompleted: false,
	}
}
