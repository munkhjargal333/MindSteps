package services

import (
	"mindsteps/database/model"
	"mindsteps/internal/shared"
	"mindsteps/internal/user/form"
	"mindsteps/internal/user/repository"
)

type UserService struct {
	userRepository repository.UserRepository
}

func NewUserService(userRepository repository.UserRepository) *UserService {
	return &UserService{
		userRepository: userRepository,
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
	if err := s.userRepository.Create(user); err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) GetByID(id uint) (*model.Users, error) {
	return s.userRepository.GetByID(id)
}

func (s *UserService) GetByEmail(email string) (*model.Users, error) {
	return s.userRepository.GetByEmail(email)
}

func (s *UserService) Update(user *model.Users) error {
	return s.userRepository.Update(user)
}

func (s *UserService) Delete(id uint) error {
	return s.userRepository.Delete(id)
}

func (s *UserService) ListAll() ([]model.Users, error) {
	return s.userRepository.ListAll()
}
