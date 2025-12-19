package form

import (
	"fmt"
	"mindsteps/database/model"
	"time"
)

type MoodEntryForm struct {
	Intensity      int    `json:"intensity" validate:"required,min=1,max=10"`
	WhenFelt       string `json:"when_felt"`
	TriggerEvent   string `json:"trigger_event"`
	CopingStrategy string `json:"coping_strategy"`
	Notes          string `json:"notes"`
	Location       string `json:"location"`
	Weather        string `json:"weather"`
	MoodUnitId     int    `json:"mood_unit_id"`
	CorevalueID    uint   `json:"core_value_id"`
	UserID         uint   `json:"user_id"`
}

func (f MoodEntryForm) Validate() error {
	if f.MoodUnitId == 0 {
		return fmt.Errorf("mood_unit_id шаардлагатай")
	}

	if f.CorevalueID == 0 {
		return fmt.Errorf("core_value_id шаардлагатай")
	}

	if f.Intensity < 1 || f.Intensity > 10 {
		return fmt.Errorf("intensity 1-10 хооронд байх ёстой")
	}
	return nil
}

func NewMoodEntryFromForm(f MoodEntryForm) *model.MoodEntries {
	return &model.MoodEntries{
		UserID:         f.UserID,
		MoodUnitID:     f.MoodUnitId,
		Intensity:      f.Intensity,
		WhenFelt:       f.WhenFelt,
		TriggerEvent:   f.TriggerEvent,
		CopingStrategy: f.CopingStrategy,
		Notes:          f.Notes,
		Location:       f.Location,
		Weather:        f.Weather,
		CoreValueID:    int64(f.CorevalueID),
		EntryDate:      time.Now(),
	}
}
