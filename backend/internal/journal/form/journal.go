package form

import (
	"fmt"
	"mindsteps/database/model"
)

type JournalForm struct {
	Title     string `json:"title" validate:"required,min=1,max=255"`
	Content   string `json:"content" validate:"required"`
	UserID    uint   `json:"user_id"`
	IsPrivate bool   `json:"is_private"`
	Tags      string `json:"tags"`
}

func (f JournalForm) Validate() error {
	if f.Title == "" {
		return fmt.Errorf("title хоосон байна")
	}
	if len(f.Title) > 255 {
		return fmt.Errorf("title 255 тэмдэгтээс урт байж болохгүй")
	}
	if f.Content == "" {
		return fmt.Errorf("content хоосон байна")
	}
	// if f.UserID == 0 {
	// 	return fmt.Errorf("user_id шаардлагатай")
	// }
	return nil
}

func NewJournalFromForm(f JournalForm) *model.Journals {
	return &model.Journals{
		Title:     f.Title,
		Content:   f.Content,
		UserID:    f.UserID,
		IsPrivate: true,
		Tags:      f.Tags,
	}
}
