package form

import (
	"fmt"
)

// UpdateProfileForm нь хэрэглэгчийн профайл шинэчлэхэд ашиглагдах формын бүтэц.
// - Name: Хэрэглэгчийн нэр (2-100 тэмдэгт, хоосон байж болно)
// - ProfilePicture: Профайл зурагны URL (хоосон байж болно)
// - Timezone: Цагийн бүс
// - Language: Хэлний сонголт ("mn" эсвэл "en")
type UpdateProfileForm struct {
	Name           string `json:"name" validate:"omitempty,min=2,max=100"`
	ProfilePicture string `json:"profile_picture" validate:"omitempty,url"`
	Timezone       string `json:"timezone"`
	Language       string `json:"language" validate:"omitempty,oneof=mn en"`
}

// Validate нь UpdateProfileForm дээрх өгөгдлийг шалгаж,
// буруу тохиолдолд алдаа буцаана.
func (f UpdateProfileForm) Validate() error {
	if f.Name != "" && (len(f.Name) < 2 || len(f.Name) > 100) {
		return fmt.Errorf("name 2-100 тэмдэгт байх ёстой")
	}
	if f.Language != "" && f.Language != "mn" && f.Language != "en" {
		return fmt.Errorf("language mn эсвэл en байх ёстой")
	}
	return nil
}

// ChangePasswordForm нь хэрэглэгчийн нууц үг солиход ашиглагдах формын бүтэц.
// - CurrentPassword: Одоогийн нууц үг (заавал шаардлагатай)
// - NewPassword: Шинэ нууц үг (заавал шаардлагатай, хамгийн багадаа 8 тэмдэгт)
// - ConfirmPassword: Шинэ нууц үгийг баталгаажуулах (NewPassword-тэй таарах ёстой)
type ChangePasswordForm struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=NewPassword"`
}

// Validate нь ChangePasswordForm дээрх өгөгдлийг шалгаж,
// буруу тохиолдолд алдаа буцаана.
func (f ChangePasswordForm) Validate() error {
	if f.CurrentPassword == "" {
		return fmt.Errorf("current_password хоосон байна")
	}
	if f.NewPassword == "" {
		return fmt.Errorf("new_password хоосон байна")
	}
	if len(f.NewPassword) < 8 {
		return fmt.Errorf("new_password 8-аас дээш тэмдэгт байх ёстой")
	}
	if f.NewPassword != f.ConfirmPassword {
		return fmt.Errorf("new_password ба confirm_password таарахгүй байна")
	}
	return nil
}
