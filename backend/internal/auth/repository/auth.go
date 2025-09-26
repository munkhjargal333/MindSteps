package repository

import (
	"errors"
	"mindsteps/database"
	"mindsteps/database/model"

	"time"

	"mindsteps/internal/shared"

	"github.com/gofiber/fiber/v2/log"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type AuthOTP struct {
	model.AuthOTP
}

type User struct {
	model.Users
}

// NewAuthOTP creates a new AuthOTP with the phone number
func NewAuthOTP(userID uint, messageID uint) *AuthOTP {
	now := database.DB.NowFunc()

	return &AuthOTP{
		AuthOTP: model.AuthOTP{
			UserID:    userID,
			MessageID: messageID,
			CreatedAt: now,
		},
	}
}

// FindAuthOTP finds the last not used and not expired AuthOTP by phone
// returns nil if not found
func FindAuthOTPByUserID(userID uint) *AuthOTP {
	a := &AuthOTP{}
	if err := database.DB.
		Where("user_id = ?", userID).
		Where("expired_at > ?", database.DB.NowFunc()).
		Last(a).Error; err != nil {
		if err != gorm.ErrRecordNotFound {
			log.Errorf("AuthOTP (FindAuthOTP): %s", err.Error())
		}

		return nil
	}

	return a
}

// SetExpiredAt sets the expired time of the AuthOTP based on the created time
func (a *AuthOTP) SetExpiredAt(expire time.Duration) {
	a.ExpiredAt = a.CreatedAt.Add(expire)
}

// SetOTP hashes the otp and sets it to the AuthOTP
// returns error if hashing fails
func (a *AuthOTP) SetOTP(otp string) error {
	hash, err := shared.GenerateHashFromPassword(otp)

	if err != nil {
		return err
	}

	a.Otp = string(hash)

	return nil
}

// Expired checks if the AuthOTP is expired
func (a *AuthOTP) Expired() bool {
	return a.ExpiredAt.Before(database.DB.NowFunc())
}

// SameOTP checks if the given otp's hash is the same as the AuthOTP's otp hash
// and save the AuthOTP as used
func (a *AuthOTP) SameOTP(otp string) bool {
	if a.ID == 0 {
		return false
	} else if a.Expired() {
		return false
	} else if err := shared.CompareHashAndPassword(a.Otp, otp); err != nil {
		return false
	}

	if err := a.Delete(); err != nil {
		log.Errorf("SameOTP (AuthOTP.Delete): %s", err.Error())

		return false
	}

	return true
}

// Save saves the AuthOTP to the database
// returns error if saving fails
func (a *AuthOTP) Save() error {
	return database.DB.Clauses(clause.Returning{}).Save(a).Error
}

// Delete deletes the AuthOTP from the database
// returns error if deleting fails
func (a *AuthOTP) Delete() error {
	return database.DB.Delete(a).Error
}

func ChangeOtpPassword(email string, newPassword string) (*User, error) {
	db := database.DB

	var user User
	if err := db.Unscoped().Where("email = ?", email).First(&user).Error; err != nil {
		return nil, errors.New("Хэрэглэгч олдсонгүй")
	}

	// Hash the new password
	hash, err := shared.GenerateHashFromPassword(newPassword)
	if err != nil {
		return nil, errors.New("Нууц үг хашлахад алдаа гарлаа")
	}

	// Update the user's password
	if err := db.Model(&user).Update("password", hash).Error; err != nil {
		return nil, errors.New("Нууц үг хадгалахад алдаа гарлаа")
	}

	return &user, nil
}
