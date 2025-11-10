package service

// import (
// 	"testing"

// 	"mindsteps/database/model"
// 	"mindsteps/internal/auth"
// 	"mindsteps/internal/user/form"
// 	"mindsteps/test/unit/mock_repository"

// 	"github.com/stretchr/testify/assert"
// 	"github.com/stretchr/testify/mock"
// 	"golang.org/x/crypto/bcrypt"
// )

// func TestRegister_Success(t *testing.T) {
// 	mockRepo := new(mock_repository.MockUserRepo)
// 	authService := service.NewAuthService(mockRepo)

// 	form := &form.RegisterForm{
// 		Name:     "Test User",
// 		Email:    "test@example.com",
// 		Password: "Password123!",
// 	}

// 	mockRepo.On("Create", mock.AnythingOfType("*model.Users")).Return(nil)

// 	user, err := authService.Register(form)

// 	assert.NoError(t, err)
// 	assert.Equal(t, "Test User", user.Name)
// 	assert.Equal(t, "test@example.com", user.Email)

// 	mockRepo.AssertExpectations(t)
// }

// func TestLogin_Success(t *testing.T) {
// 	// JWT mock-ыг Gjwt-д оноож өгнө
// 	auth.Gjwt = &mock_repository.MockGJWT{}

// 	mockRepo := new(mock_repository.MockUserRepo)
// 	authService := services.NewAuthService(mockRepo)

// 	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("Password123!"), bcrypt.DefaultCost)
// 	mockUser := &model.Users{
// 		ID:       1,
// 		Name:     "Test User",
// 		Email:    "test@example.com",
// 		Password: string(hashedPassword),
// 	}

// 	mockRepo.On("GetByEmail", "test@example.com").Return(mockUser, nil)

// 	form := &form.LoginForm{
// 		Email:    "test@example.com",
// 		Password: "Password123!",
// 	}

// 	token, err := authService.Login(form)

// 	assert.NoError(t, err)
// 	assert.Equal(t, "mocked-token", token)

// 	mockRepo.AssertExpectations(t)
// }

// func TestLogin_InvalidPassword(t *testing.T) {
// 	auth.Gjwt = &mock_repository.MockGJWT{}

// 	mockRepo := new(mock_repository.MockUserRepo)
// 	authService := services.NewAuthService(mockRepo)

// 	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("Password123!"), bcrypt.DefaultCost)
// 	mockUser := &model.Users{
// 		ID:       1,
// 		Name:     "Test User",
// 		Email:    "test@example.com",
// 		Password: string(hashedPassword),
// 	}

// 	mockRepo.On("GetByEmail", "test@example.com").Return(mockUser, nil)

// 	form := &form.LoginForm{
// 		Email:    "test@example.com",
// 		Password: "WrongPassword",
// 	}

// 	token, err := authService.Login(form)

// 	assert.Error(t, err)
// 	assert.Equal(t, "", token)

// 	mockRepo.AssertExpectations(t)
// }

// func TestLogin_NonexistentEmail(t *testing.T) {
// 	auth.Gjwt = &mock_repository.MockGJWT{}

// 	mockRepo := new(mock_repository.MockUserRepo)
// 	authService := services.NewAuthService(mockRepo)

// 	mockRepo.On("GetByEmail", "notfound@example.com").Return((*model.Users)(nil), assert.AnError)

// 	form := &form.LoginForm{
// 		Email:    "notfound@example.com",
// 		Password: "Password123!",
// 	}

// 	token, err := authService.Login(form)

// 	assert.Error(t, err)
// 	assert.Equal(t, "", token)

// 	mockRepo.AssertExpectations(t)
// }
