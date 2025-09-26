package form

import (
	"fmt"
	"strings"
)

type Login struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
	Type     string `json:"type"`
}

type ResetPassword struct {
	Email string `json:"email" validate:"required,email"`
}

type CheckOtp struct {
	Email string `json:"email" validate:"required,email"`
	Otp   string `json:"otp" validate:"required"`
}

type OtpPassword struct {
	Newpassword string `json:"new_password" validate:"required"`
}

type ChangePassword struct {
	Oldpassword string `json:"old_password" validate:"required"`
	Newpassword string `json:"new_password" validate:"required"`
}

func (u Login) Validate() error {

	errs := make([]string, 0)

	if u.Email == "" {
		errs = append(errs, "email оруулна уу")
	}
	if u.Password == "" {
		errs = append(errs, "password оруулна уу")
	}

	if len(errs) > 0 {
		return fmt.Errorf(strings.Join(errs, ", "))
	}
	return nil
}

func (u ChangePassword) Validate() error {

	errs := make([]string, 0)

	if u.Oldpassword == "" {
		errs = append(errs, "Хуучин нууц үгээ оруулна уу")
	}
	if u.Newpassword == "" {
		errs = append(errs, "Шинэ нууц үгээ оруулна уу")
	}

	if len(errs) > 0 {
		return fmt.Errorf(strings.Join(errs, ", "))
	}
	return nil
}
