package services

import (
	"mindsteps/database/model"
	"mindsteps/internal/shared"
	"mindsteps/internal/user/form"
	"mindsteps/internal/user/repository"
)

type UserService struct {
	repo repository.UserRepository
}

func NewUserService() *UserService {
	return &UserService{
		repo: repository.NewUserRepository(),
	}
}

func (s *UserService) Register(form *form.RegisterForm) (*model.Users, error) {

	hashedPassword, err := shared.GenerateHashFromPassword(form.Password)
	if err != nil {
		return nil, err
	}

	user := &model.Users{
		Name:     form.Name,
		Email:    form.Email,
		Password: string(hashedPassword),
	}
	if err := s.repo.Create(user); err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) GetByID(id uint) (*model.Users, error) {
	return s.repo.GetByID(id)
}

func (s *UserService) GetByEmail(email string) (*model.Users, error) {
	return s.repo.GetByEmail(email)
}

func (s *UserService) Update(user *model.Users) error {
	return s.repo.Update(user)
}

func (s *UserService) Delete(id uint) error {
	return s.repo.Delete(id)
}

func (s *UserService) ListAll() ([]model.Users, error) {
	return s.repo.ListAll()
}
