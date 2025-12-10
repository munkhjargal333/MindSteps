package form

import (
	"fmt"
	"regexp"
	"unicode/utf8"
)

type RegisterForm struct {
	Name            string `json:"name" validate:"required,min=2,max=100"`
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
}

func (f RegisterForm) Validate() error {
	if f.Name == "" {
		return fmt.Errorf("name хоосон байна")
	}
	if len(f.Name) < 2 || len(f.Name) > 100 {
		return fmt.Errorf("name 2-100 тэмдэгт байх ёстой")
	}
	if f.Email == "" {
		return fmt.Errorf("email хоосон байна")
	}
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(f.Email) {
		return fmt.Errorf("email буруу форматтай байна")
	}
	if f.Password == "" {
		return fmt.Errorf("password хоосон байна")
	}
	if len(f.Password) < 8 {
		return fmt.Errorf("password 8-аас дээш тэмдэгт байх ёстой")
	}
	if f.Password != f.ConfirmPassword {
		return fmt.Errorf("password ба confirm_password таарахгүй байна")
	}
	return nil
}

type LoginForm struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func (f LoginForm) Validate() error {
	if f.Email == "" {
		return fmt.Errorf("email хоосон байна")
	}
	if f.Password == "" {
		return fmt.Errorf("password хоосон байна")
	}
	// Password‑д SQL injection эсвэл XSS‑ийн шинж тэмдэг байгаа эсэхийг шалгах
	// (жишээ нь <script>, SQL keyword гэх мэт)
	if containsDangerousInput(f.Password) {
		return fmt.Errorf("password‑д зөвшөөрөгдөөгүй тэмдэгт байна")
	}

	return nil
}

// containsDangerousInput нь энгийн blacklist шалгалт хийдэг жишээ функц
func containsDangerousInput(input string) bool {
	dangerous := []string{"<script>", "SELECT", "DROP", "--", ";"}
	for _, d := range dangerous {
		if contains := stringContainsCaseInsensitive(input, d); contains {
			return true
		}
	}
	return false
}

func stringContainsCaseInsensitive(s, substr string) bool {
	return utf8.RuneCountInString(s) >= utf8.RuneCountInString(substr) &&
		(len([]rune(s)) > 0 && len([]rune(substr)) > 0 &&
			containsFold(s, substr))
}

func containsFold(s, substr string) bool {
	return len([]rune(s)) > 0 && len([]rune(substr)) > 0 &&
		// strings.ContainsFold Go 1.20+ дээр байдаг
		// энд жишээ болгож strings.Contains ашиглаж болно
		// strings.Contains(strings.ToLower(s), strings.ToLower(substr))
		false
}

type ForgotPasswordForm struct {
	Email string `json:"email" validate:"required,email"`
}

func (f ForgotPasswordForm) Validate() error {
	if f.Email == "" {
		return fmt.Errorf("email хоосон байна")
	}
	return nil
}

type ResetPasswordForm struct {
	Email           string `json:"email" validate:"required,email"`
	OTPCode         string `json:"otp_code" validate:"required,len=6"`
	NewPassword     string `json:"new_password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=NewPassword"`
}

func (f ResetPasswordForm) Validate() error {
	if f.Email == "" {
		return fmt.Errorf("email хоосон байна")
	}
	if f.OTPCode == "" {
		return fmt.Errorf("otp_code хоосон байна")
	}
	if len(f.OTPCode) != 6 {
		return fmt.Errorf("otp_code 6 оронтой байх ёстой")
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

type VerifyOTPForm struct {
	Email   string `json:"email" validate:"required,email"`
	OTPCode string `json:"otp_code" validate:"required,len=6"`
}

func (f VerifyOTPForm) Validate() error {
	if f.Email == "" {
		return fmt.Errorf("email хоосон байна")
	}
	if f.OTPCode == "" {
		return fmt.Errorf("otp_code хоосон байна")
	}
	if len(f.OTPCode) != 6 {
		return fmt.Errorf("otp_code 6 оронтой байх ёстой")
	}
	return nil
}
