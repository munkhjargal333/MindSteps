package repository

import (
	"crypto/sha256"
	"encoding/hex"
	"mindsteps/database/model"
	"time"

	"gorm.io/gorm"
)

type AuthRepository interface {
	CreateOTP(otp *model.AuthOTP) error
	FindValidOTP(email, otpCode, otpType string) (*model.AuthOTP, error)
	MarkOTPAsUsed(id uint) error
	CreateSession(session *model.UserSessions) error
	FindSessionByToken(tokenHash string) (*model.UserSessions, error)
	RevokeSession(tokenHash string) error
	CleanupExpiredOTPs() error
}

type authRepo struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepo{db: db}
}

func (r *authRepo) CreateOTP(otp *model.AuthOTP) error {
	return r.db.Create(otp).Error
}

func (r *authRepo) FindValidOTP(email, otpCode, otpType string) (*model.AuthOTP, error) {
	var otp model.AuthOTP
	var user model.Users

	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}

	err := r.db.Where("user_id = ? AND otp_code = ? AND otp_type = ? AND is_used = ? AND expired_at > ? AND deleted_at IS NULL",
		user.ID, otpCode, otpType, false, time.Now()).
		First(&otp).Error

	if err != nil {
		return nil, err
	}
	return &otp, nil
}

func (r *authRepo) MarkOTPAsUsed(id uint) error {
	now := time.Now()
	return r.db.Model(&model.AuthOTP{}).Where("id = ?", id).Updates(map[string]interface{}{
		"is_used": true,
		"used_at": now,
	}).Error
}

func (r *authRepo) CreateSession(session *model.UserSessions) error {
	return r.db.Create(session).Error
}

func (r *authRepo) FindSessionByToken(tokenHash string) (*model.UserSessions, error) {
	var session model.UserSessions
	err := r.db.Where("token_hash = ? AND is_active = ? AND expires_at > ?",
		tokenHash, true, time.Now()).First(&session).Error
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *authRepo) RevokeSession(tokenHash string) error {
	now := time.Now()
	return r.db.Model(&model.UserSessions{}).Where("token_hash = ?", tokenHash).Updates(map[string]interface{}{
		"is_active":     false,
		"revoked_at":    now,
		"revoke_reason": "logout",
	}).Error
}

func (r *authRepo) CleanupExpiredOTPs() error {
	return r.db.Where("expired_at < ? OR is_used = ?", time.Now().AddDate(0, 0, -1), true).
		Delete(&model.AuthOTP{}).Error
}

func HashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}
