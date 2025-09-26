package shared

import (
	"net/mail"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/go-playground/validator/v10"
)

// Checks if val is a validated
func Validate(val interface{}) error {
	validate := validator.New()

	validators := map[string]validator.Func{
		"register":  isRegNo,
		"phone":     isPhoneNo,
		"birthdate": isBirthDate,
	}
	for key, value := range validators {
		if err := validate.RegisterValidation(key, value); err != nil {
			return err
		}
	}

	if err := validate.Struct(val); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		return validationErrors
	}
	return nil
}

// Checks if val is a email
func IsEmail(val string) bool {
	_, err := mail.ParseAddress(val)
	return err == nil
}

// Checks if val is a vehicle's plate no
func IsPlateNo(val string) bool {
	ok, _ := regexp.MatchString("^[а-яА-ЯөӨүҮ]{3}[0-9]{4}$", val)
	return ok
}

// Checks if val is a numeric
func IsNumeric(str string) bool {
	if _, err := strconv.Atoi(str); err != nil {
		return false
	}
	return true
}

// Checks if val is a citizen's register number
func isRegNo(fl validator.FieldLevel) bool {
	field := fl.Field()

	if field.Kind() != reflect.String {
		return false
	}

	ok, _ := regexp.MatchString("^[а-яА-ЯөӨүҮ]{2}[0-9]{8}$", field.String())
	return ok
}

func IsRegNo(regNo string) bool {
	ok, err := regexp.MatchString("^[а-яА-ЯөӨүҮ]{2}[0-9]{8}$", regNo)
	if err != nil {
		return false
	}
	return ok
}
func IsValidPhoneNumber(phone string) bool {
	ok, err := regexp.MatchString(`^\d{8}$`, phone)
	if err != nil {
		return false
	}
	return ok
}
func IsValidEmail(email string) bool {
	ok, err := regexp.MatchString(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, email)
	if err != nil {
		return false
	}
	return ok
}

func IsValidPassword(password string) (bool, string) {
	// Check if the password is at least 8 characters long
	if len(password) < 8 {
		return false, "Password must be at least 8 characters long"
	}

	// Check if the password contains at least one lowercase letter
	hasLower := false
	for _, char := range password {
		if unicode.IsLower(char) {
			hasLower = true
			break
		}
	}
	if !hasLower {
		return false, "Password must contain at least one lowercase letter"
	}

	// Check if the password contains at least one uppercase letter
	hasUpper := false
	for _, char := range password {
		if unicode.IsUpper(char) {
			hasUpper = true
			break
		}
	}
	if !hasUpper {
		return false, "Password must contain at least one uppercase letter"
	}

	// Check if the password contains at least one digit
	hasDigit := false
	for _, char := range password {
		if unicode.IsDigit(char) {
			hasDigit = true
			break
		}
	}
	if !hasDigit {
		return false, "Password must contain at least one digit"
	}

	// Check if the password contains at least one special character
	hasSpecial := false
	specialChars := "!@#$%^&*()-_=+[]{};:'\"<>,.?/"
	for _, char := range password {
		if strings.ContainsRune(specialChars, char) {
			hasSpecial = true
			break
		}
	}
	if !hasSpecial {
		return false, "Password must contain at least one special character"
	}

	return true, ""
}

// Checks if val is a phone number
func isPhoneNo(fl validator.FieldLevel) bool {
	field := fl.Field()

	if field.Kind() != reflect.String {
		return false
	}

	ok, _ := regexp.MatchString(`^\d{8}$`, field.String())
	return ok
}

// Checks if val is a birthdate
func isBirthDate(fl validator.FieldLevel) bool {
	field := fl.Field()

	if field.Kind() != reflect.String {
		return false
	}

	_, err := time.Parse(time.DateOnly, field.String())
	return err == nil
}

func SearchStrings(stringArray []string, target string) bool {
	for _, str := range stringArray {
		if str == target {
			return true
		}
	}
	return false
}

func IndexOf(params ...interface{}) int {
	v := reflect.ValueOf(params[0])
	arr := reflect.ValueOf(params[1])

	var t = reflect.TypeOf(params[1]).Kind()

	if t != reflect.Slice && t != reflect.Array {
		panic("Type Error! Second argument must be an array or a slice.")
	}

	for i := 0; i < arr.Len(); i++ {
		if arr.Index(i).Interface() == v.Interface() {
			return i
		}
	}
	return -1
}
