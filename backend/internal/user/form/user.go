package form

import (
	"fmt"
	"mindsteps/internal/shared"
)

type RegisterForm struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

func (u RegisterForm) Validate() error {
	if !shared.IsValidEmail(u.Email) {
		return fmt.Errorf("email хаяг буруу байна")
	}

	if ok, msg := shared.IsValidPassword(u.Password); !ok {
		return fmt.Errorf("password хангалтгүй байна: %s", msg)
	}
	return nil
}

type LoginForm struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func (u LoginForm) Validate() error {
	if !shared.IsValidEmail(u.Email) {
		return fmt.Errorf("email хаяг буруу байна")
	}

	if ok, msg := shared.IsValidPassword(u.Password); !ok {
		return fmt.Errorf("password хангалтгүй байна: %s", msg)
	}
	return nil
}
