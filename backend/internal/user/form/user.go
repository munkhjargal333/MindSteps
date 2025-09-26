package form

import (
	"fmt"
	"strings"
	"time"
)

type User struct {
	FamilyName        string `json:"family_name" validate:"omitempty,min=2,max=160"`
	LastName          string `json:"last_name" validate:"omitempty,min=2,max=160"`
	FirstName         string `json:"first_name" validate:"omitempty,min=2,max=160"`
	BirthDate         string `json:"birth_date" validate:"omitempty,birthdate"`
	GenderCode        string `json:"gender_code" validate:"omitempty,oneof=MALE FEMALE OTHER"`
	AimagCode         string `json:"aimag_code" validate:"omitempty,max=3"`
	SumCode           string `json:"sum_code" validate:"omitempty,max=3"`
	BagCode           string `json:"bag_code" validate:"omitempty,max=3"`
	AddressDetail     string `json:"address_detail" validate:"omitempty,max=500"`
	ProfilePictureURL string `json:"profile_picture_url" validate:"omitempty,max=500"`
	Description       string `json:"description" validate:"omitempty,max=300"`
}

type CreateUser struct {
	ID                *uint
	Phone             string `form:"phone"`
	Email             string `form:"email"`
	FirstName         string `form:"first_name"`
	LastName          string `form:"last_name"`
	Regno             string `form:"reg_no"`
	RoleCode          string `form:"role_code"`
	Decsription       string `form:"decsription"`
	PositionCode      string `form:"position_code"`
	OrganizationID    string `form:"organization_id"`
	Password          string `form:"password"`
	AimagCode         string `form:"aimag_code" validate:"omitempty,max=3"`
	SumCode           string `form:"sum_code" validate:"omitempty,max=3"`
	BagCode           string `form:"bag_code" validate:"omitempty,max=3"`
	AddressDetail     string `form:"address_detail"`
	ProfilePictureURL string `form:"profile_picture_url"`
	RoleID            string `form:"role_id"`

	DriverLicenseType *string `form:"driver_license_type"`
	LicenseNumber     *string `form:"license_number"`
	GraduatedDate     *string `form:"graduated_date"`
	ExpiredDate       *string `form:"expired_date"`
}

type RegisterUser struct {
	Phone     string `json:"phone"`
	Passsword string `json:"passsword"`
	Hash      string `json:"hash"`
}

type SystemUserGet struct {
	ID                uint       `json:"id"`
	Email             string     `json:"email"`
	LastName          string     `json:"last_name"`
	FirstName         *string    `json:"first_name"`
	RegNo             *string    `json:"reg_no"`
	ProfilePictureUrl *string    `json:"profile_picture_url"`
	Phone             *string    `json:"phone"`
	CreatedAt         *time.Time `json:"created_at"`
	UpdatedAt         *time.Time `json:"updated_at"`
	Status            *string    `json:"status"`
	Description       *string    `json:"description"`
	Address           *string    `json:"address"`
	OrganizationName  *string    `json:"organization_name"`
	PositionName      string     `json:"position_name"`
	OrganizationId    *uint      `json:"organization_id"`
	PositionCode      *string    `json:"position_code"`
	Roles             []string   `json:"roles,omitempty"`
	// driver
	DriverLicenseType *string `json:"driver_license_type"`
	LicenseNumber     *string `json:"license_number"`
	GraduatedDate     *string `json:"graduated_date"`
}

type SystemUserList struct {
	ID                uint       `json:"id"`
	Email             string     `json:"email"`
	LastName          string     `json:"last_name"`
	FirstName         *string    `json:"first_name"`
	OrganizationName  *string    `json:"organization_name"`
	ProfilePictureUrl *string    `json:"profile_picture_url"`
	PositionName      string     `json:"position_name"`
	PositionCode      string     `json:"position_code"`
	Phone             string     `json:"phone"`
	CreatedAt         *time.Time `json:"created_at"`
	UpdatedAt         *time.Time `json:"updated_at"`
	Status            *string    `json:"status"`
	RoleName          string     `json:"role_name"`
}

type AppUserList struct {
	ID          uint       `json:"id"`
	Phone       string     `json:"phone"`
	TypeName    *string    `json:"type_name"`
	Balance     *int       `json:"balance"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
	ExpireDate  *time.Time `json:"expire_date"`
	Status      *string    `json:"status"`
	UpEmail     *string    `json:"up_email"`
	UpName      *string    `json:"up_name"`
	DefaultCard int        `json:"default_card"`
}

type UserDeleteReq struct {
	Status *string `json:"status"`
}

func (u *UserDeleteReq) Validate() error {
	errs := make([]string, 0)

	if strings.TrimSpace(*u.Status) == "" {
		errs = append(errs, "Утга явуулна уу")
	}

	if len(errs) > 0 {
		return fmt.Errorf(strings.Join(errs, ", "))
	}

	return nil
}

type CntResponse struct {
	All         int64 `json:"all"`
	IsNotActive int64 `json:"is_not_active"`
	IsActive    int64 `json:"is_active"`
	IsDeleted   int64 `json:"is_deleted"`
}
