package form

import (
	"fmt"
	"mindsteps/database/model"
	"time"
)

type MoodEntryForm struct {
	MoodID          int    `json:"mood_id" validate:"required"`
	Intensity       int    `json:"intensity" validate:"required,min=1,max=10"`
	WhenFelt        string `json:"when_felt"`
	TriggerEvent    string `json:"trigger_event"`
	CopingStrategy  string `json:"coping_strategy"`
	Notes           string `json:"notes"`
	Location        string `json:"location"`
	Weather         string `json:"weather"`
	RelatedValueIds uint   `json:"related_value_ids"`
	UserID          uint   `json:"user_id"`
}

func (f MoodEntryForm) Validate() error {
	if f.MoodID == 0 {
		return fmt.Errorf("mood_id шаардлагатай")
	}
	if f.Intensity < 1 || f.Intensity > 10 {
		return fmt.Errorf("intensity 1-10 хооронд байх ёстой")
	}
	if f.WhenFelt != "" {
		validWhen := map[string]bool{"morning": true, "afternoon": true, "evening": true, "night": true}
		if !validWhen[f.WhenFelt] {
			return fmt.Errorf("when_felt: morning, afternoon, evening, night-ийн аль нэг байх ёстой")
		}
	}
	return nil
}

func NewMoodEntryFromForm(f MoodEntryForm) *model.MoodEntries {
	return &model.MoodEntries{
		UserID:          f.UserID,
		MoodID:          f.MoodID,
		Intensity:       f.Intensity,
		WhenFelt:        f.WhenFelt,
		TriggerEvent:    f.TriggerEvent,
		CopingStrategy:  f.CopingStrategy,
		Notes:           f.Notes,
		Location:        f.Location,
		Weather:         f.Weather,
		RelatedValueIds: f.RelatedValueIds,
		EntryDate:       time.Now(),
	}
}
