package form

import (
	"fmt"
	"mindsteps/database/model"
	"time"
)

type MoodForm struct {
	CategoryID int `json:"category_id" validate:"required"`
	// NameEn         string `json:"name_en" validate:"required"`
	// NameMn         string `json:"name_mn" validate:"required"`
	Description    string `json:"description"`
	IntensityLevel int    `json:"intensity_level" validate:"min=1,max=10"`
	// Emoji          string `json:"emoji" validate:"max=10"`
}

// Validate basic rules
func (f MoodForm) Validate() error {
	if f.CategoryID == 0 {
		return fmt.Errorf("category_id шаардлагатай")
	}

	if f.IntensityLevel < 0 || f.IntensityLevel > 10 {
		return fmt.Errorf("intensity_level 0–10 хооронд байх ёстой")
	}
	return nil
}

// Convert to model struct
func NewMoodFromForm(f MoodForm) *model.Moods {
	return &model.Moods{
		CategoryID:     f.CategoryID,
		Description:    f.Description,
		IntensityLevel: f.IntensityLevel,
		CreatedAt:      time.Now(),
	}
}
