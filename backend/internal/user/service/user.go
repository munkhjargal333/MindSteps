package service

import (
	"fmt"
	"mindsteps/database/model"
	userForm "mindsteps/internal/user/form"
	"mindsteps/internal/user/repository"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	GetProfile(userID uint) (*model.Users, error)
	UpdateProfile(userID uint, form *userForm.UpdateProfileForm) (*model.Users, error)
	ChangePassword(userID uint, form *userForm.ChangePasswordForm) error
	DeleteAccount(userID uint) error
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) GetProfile(userID uint) (*model.Users, error) {
	return s.repo.FindByID(userID)
}

func (s *userService) UpdateProfile(userID uint, f *userForm.UpdateProfileForm) (*model.Users, error) {
	if err := f.Validate(); err != nil {
		return nil, err
	}

	user, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	if f.Name != "" {
		user.Name = f.Name
	}
	if f.ProfilePicture != "" {
		user.ProfilePicture = f.ProfilePicture
	}
	if f.Timezone != "" {
		user.Timezone = f.Timezone
	}
	if f.Language != "" {
		user.Language = f.Language
	}

	user.UpdatedAt = time.Now()

	if err := s.repo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) ChangePassword(userID uint, f *userForm.ChangePasswordForm) error {
	if err := f.Validate(); err != nil {
		return err
	}

	user, err := s.repo.FindByID(userID)
	if err != nil {
		return err
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(f.CurrentPassword)); err != nil {
		return fmt.Errorf("current_password буруу байна")
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(f.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.repo.UpdatePassword(userID, string(hashedPassword))
}

func (s *userService) DeleteAccount(userID uint) error {
	return s.repo.Delete(userID)
}
