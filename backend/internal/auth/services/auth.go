package services

import (
	"errors"
	"mindsteps/database/model"
	"mindsteps/internal/auth"
	"mindsteps/internal/shared"
	"mindsteps/internal/user/form"
	"mindsteps/internal/user/repository"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo repository.UserRepository
}

func NewAuthService(repo repository.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Register(f *form.RegisterForm) (*model.Users, error) {
	if !shared.IsValidEmail(f.Email) {
		return nil, errors.New("email буруу байна")
	}
	if ok, msg := shared.IsValidPassword(f.Password); !ok {
		return nil, errors.New(msg)
	}

	// password hash
	hashed, err := bcrypt.GenerateFromPassword([]byte(f.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.Users{
		Name:     f.Name,
		Email:    f.Email,
		Password: string(hashed),
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(f *form.LoginForm) (string, error) {
	user, err := s.repo.GetByEmail(f.Email)
	if err != nil {
		return "", errors.New("email бүртгэлгүй байна")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(f.Password)); err != nil {
		return "", err
	}

	//fmt.Println(user)
	claims := &auth.Token{
		UserID: user.ID,
	}

	tokenStr, err := auth.Gjwt.GenerateToken(claims, 600000)
	if err != nil {
		return "", err
	}

	return tokenStr, nil
}
