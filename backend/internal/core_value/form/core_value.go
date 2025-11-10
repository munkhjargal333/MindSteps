package form

import (
	"fmt"
	"mindsteps/database/model"
)

type CoreValueForm struct {
	Name          string `json:"name" validate:"required,min=2,max=100"`
	Description   string `json:"description"`
	MaslowLevelID *int   `json:"maslow_level_id" validate:"omitempty,min=1,max=5"`
	Color         string `json:"color" validate:"required"`
	Icon          string `json:"icon"`
	PriorityOrder int    `json:"priority_order" validate:"required,min=1,max=7"`
	UserID        uint   `json:"user_id"`
	IsActive      bool   `json:"is_active"`
}

func (f CoreValueForm) Validate() error {
	if f.Name == "" {
		return fmt.Errorf("name хоосон байна")
	}
	if len(f.Name) < 2 || len(f.Name) > 100 {
		return fmt.Errorf("name 2-100 тэмдэгт байх ёстой")
	}
	if f.MaslowLevelID != nil && (*f.MaslowLevelID < 1 || *f.MaslowLevelID > 5) {
		return fmt.Errorf("maslow_level_id 1-5 хооронд байх ёстой")
	}
	if f.Color == "" {
		return fmt.Errorf("color хоосон байна")
	}
	if f.PriorityOrder < 1 || f.PriorityOrder > 7 {
		return fmt.Errorf("priority_order 1-7 хооронд байх ёстой")
	}
	return nil
}

func NewCoreValueFromForm(f CoreValueForm) *model.CoreValues {
	return &model.CoreValues{
		UserID:        f.UserID,
		Name:          f.Name,
		Description:   f.Description,
		MaslowLevelID: *f.MaslowLevelID,
		Color:         f.Color,
		Icon:          f.Icon,
		PriorityOrder: f.PriorityOrder,
		IsActive:      true,
	}
}
