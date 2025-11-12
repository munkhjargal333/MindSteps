package form

import (
	"fmt"
	"mindsteps/database/model"
	"strings"
)

type JournalForm struct {
	Title           string `json:"title" validate:"omitempty,max=255"`
	Content         string `json:"content" validate:"required,min=10"`
	IsPrivate       bool   `json:"is_private"`
	Tags            string `json:"tags"`
	RelatedValueIds int    `json:"related_value_ids"`
	UserID          uint   `json:"user_id"`
}

func (f JournalForm) Validate() error {
	if f.Content == "" {
		return fmt.Errorf("content хоосон байна")
	}
	if len(f.Content) < 10 {
		return fmt.Errorf("content 10-аас дээш тэмдэгт байх ёстой")
	}
	if f.Title != "" && len(f.Title) > 255 {
		return fmt.Errorf("title 255 тэмдэгтээс урт байж болохгүй")
	}
	return nil
}

func NewJournalFromForm(f JournalForm) *model.Journals {
	wordCount := len(strings.Fields(f.Content))

	return &model.Journals{
		UserID:    f.UserID,
		Title:     f.Title,
		Content:   f.Content,
		IsPrivate: f.IsPrivate,
		Tags:      f.Tags,
		//RelatedValueIds: int64(f.RelatedValueIds),
		WordCount: wordCount,
	}
}
