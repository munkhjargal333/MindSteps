package service

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"mindsteps/database/model"
	"mindsteps/internal/auth"
	authForm "mindsteps/internal/auth/form"
	authRepo "mindsteps/internal/auth/repository"
	userRepo "mindsteps/internal/user/repository"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(form *authForm.RegisterForm) (string, *model.Users, error)
	Login(form *authForm.LoginForm) (string, *model.Users, error)
	Logout(token string) error
	ForgotPassword(form *authForm.ForgotPasswordForm) error
	ResetPassword(form *authForm.ResetPasswordForm) error
	VerifyOTP(form *authForm.VerifyOTPForm) error
}

type authService struct {
	userRepo userRepo.UserRepository
	authRepo authRepo.AuthRepository
}

func NewAuthService(userRepo userRepo.UserRepository, authRepo authRepo.AuthRepository) AuthService {
	return &authService{
		userRepo: userRepo,
		authRepo: authRepo,
	}
}

func (s *authService) Register(f *authForm.RegisterForm) (string, *model.Users, error) {
	if err := f.Validate(); err != nil {
		return "", nil, err
	}

	// Check if email exists
	existing, _ := s.userRepo.FindByEmail(f.Email)
	if existing != nil {
		return "", nil, fmt.Errorf("email аль хэдийн бүртгэлтэй байна")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(f.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", nil, err
	}

	// Create user
	user := &model.Users{
		UUID:      uuid.New().String(),
		Name:      f.Name,
		Email:     f.Email,
		Password:  string(hashedPassword),
		Language:  "mn",
		Timezone:  "Asia/Ulaanbaatar",
		IsActive:  true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.userRepo.Create(user); err != nil {
		return "", nil, err
	}

	// Generate email verification OTP
	otpCode := generateOTP()
	otp := &model.AuthOTP{
		UserID:    user.ID,
		OtpCode:   otpCode,
		OtpType:   "email_verification",
		ExpiredAt: time.Now().Add(10 * time.Minute),
		CreatedAt: time.Now(),
	}
	s.authRepo.CreateOTP(otp)

	// TODO: Send email with OTP

	// Generate token
	claims := auth.Token{
		UserID:    user.ID,
		UserEmail: user.Email,
	}

	token, err := auth.Gjwt.GenerateToken(&claims, time.Duration(144000*3))

	// Create session
	tokenHash := authRepo.HashToken(token)
	session := &model.UserSessions{
		UserID:       user.ID,
		TokenHash:    tokenHash,
		IsActive:     true,
		LastActivity: time.Now(),
		ExpiresAt:    time.Now().Add(24 * 7 * time.Hour),
		CreatedAt:    time.Now(),
	}
	s.authRepo.CreateSession(session)

	return token, user, nil
}

func (s *authService) Login(f *authForm.LoginForm) (string, *model.Users, error) {
	if err := f.Validate(); err != nil {
		return "", nil, err
	}

	user, err := s.userRepo.FindByEmail(f.Email)
	if err != nil {
		return "", nil, fmt.Errorf("email эсвэл password буруу байна")
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(f.Password)); err != nil {
		return "", nil, fmt.Errorf("email эсвэл password буруу байна")
	}

	if !user.IsActive {
		return "", nil, fmt.Errorf("таны эрхийг хаасан байна")
	}

	// Update last login
	s.userRepo.UpdateLastLogin(user.ID)
	s.userRepo.IncrementLoginCount(user.ID)

	//TODO ажиллагаа хянах
	// Generate token
	claims := auth.Token{
		UserID:    user.ID,
		UserEmail: user.Email,
	}

	token, err := auth.Gjwt.GenerateToken(&claims, time.Duration(144000*3))

	if err != nil {
		return "", nil, err
	}

	// Create session
	tokenHash := authRepo.HashToken(token)
	session := &model.UserSessions{
		UserID:       user.ID,
		TokenHash:    tokenHash,
		IsActive:     true,
		LastActivity: time.Now(),
		ExpiresAt:    time.Now().Add(24 * 7 * time.Hour),
		CreatedAt:    time.Now(),
	}
	s.authRepo.CreateSession(session)

	return token, user, nil
}

func (s *authService) Logout(token string) error {
	tokenHash := authRepo.HashToken(token)
	return s.authRepo.RevokeSession(tokenHash)
}

func (s *authService) ForgotPassword(f *authForm.ForgotPasswordForm) error {
	if err := f.Validate(); err != nil {
		return err
	}

	user, err := s.userRepo.FindByEmail(f.Email)
	if err != nil {
		// Don't reveal if email exists or not for security
		return nil
	}

	// Generate OTP
	otpCode := generateOTP()
	otp := &model.AuthOTP{
		UserID:    user.ID,
		OtpType:   otpCode,
		OtpCode:   "password_reset",
		ExpiredAt: time.Now().Add(10 * time.Minute),
		CreatedAt: time.Now(),
	}

	if err := s.authRepo.CreateOTP(otp); err != nil {
		return err
	}

	// TODO: Send email with OTP
	fmt.Printf("Password reset OTP for %s: %s\n", f.Email, otpCode)

	return nil
}

func (s *authService) ResetPassword(f *authForm.ResetPasswordForm) error {
	if err := f.Validate(); err != nil {
		return err
	}

	// Verify OTP
	otp, err := s.authRepo.FindValidOTP(f.Email, f.OTPCode, "password_reset")
	if err != nil {
		return fmt.Errorf("OTP буруу эсвэл хүчинтэй хугацаа дууссан байна")
	}

	// Get user
	user, err := s.userRepo.FindByID(otp.UserID)
	if err != nil {
		return err
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(f.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Update password
	if err := s.userRepo.UpdatePassword(user.ID, string(hashedPassword)); err != nil {
		return err
	}

	// Mark OTP as used
	s.authRepo.MarkOTPAsUsed(otp.ID)

	return nil
}

func (s *authService) VerifyOTP(f *authForm.VerifyOTPForm) error {
	if err := f.Validate(); err != nil {
		return err
	}

	otp, err := s.authRepo.FindValidOTP(f.Email, f.OTPCode, "email_verification")
	if err != nil {
		return fmt.Errorf("OTP буруу эсвэл хүчинтэй хугацаа дууссан байна")
	}

	// Mark email as verified
	user, err := s.userRepo.FindByID(otp.UserID)
	if err != nil {
		return err
	}

	now := time.Now()
	user.IsEmailVerified = true
	user.EmailVerifiedAt = now
	s.userRepo.Update(user)

	// Mark OTP as used
	s.authRepo.MarkOTPAsUsed(otp.ID)

	return nil
}

func generateOTP() string {
	const digits = "0123456789"
	otp := make([]byte, 6)
	for i := range otp {
		num, _ := rand.Int(rand.Reader, big.NewInt(int64(len(digits))))
		otp[i] = digits[num.Int64()]
	}
	return string(otp)
}
