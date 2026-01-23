package service

import (
	"mindsteps/database/model"
	userForm "mindsteps/internal/user/form"
	"mindsteps/internal/user/repository"
	"time"
)

type UserService interface {
	GetProfile(userID string) (*model.Users, error)
	UpdateProfile(userID string, form *userForm.UpdateProfileForm) (*model.Users, error)
	DeleteAccount(userID string) error
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) GetProfile(userID string) (*model.Users, error) {
	return s.repo.FindByID(userID)
}

func (s *userService) UpdateProfile(userID string, f *userForm.UpdateProfileForm) (*model.Users, error) {
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

func (s *userService) DeleteAccount(userID string) error {
	return s.repo.Delete(userID)
}
