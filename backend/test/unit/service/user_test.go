package service_test

import (
	"errors"
	"testing"

	"mindsteps/database/model"
	userForm "mindsteps/internal/user/form"
	userService "mindsteps/internal/user/service"
	mockRepository "mindsteps/test/unit/mockRepository"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUserService_GetProfile_Success(t *testing.T) {
	// Arrange
	mockRepo := new(mockRepository.MockUserRepository)
	svc := userService.NewUserService(mockRepo)

	expectedUser := &model.Users{
		ID:    1,
		Name:  "Test User",
		Email: "test@example.com",
	}

	mockRepo.On("FindByID", uint(1)).Return(expectedUser, nil)

	// Act
	result, err := svc.GetProfile(1)

	// Assert
	assert.NoError(t, err)
	assert.Equal(t, expectedUser, result)
	mockRepo.AssertExpectations(t)
}

func TestUserService_GetProfile_NotFound(t *testing.T) {
	// Arrange
	mockRepo := new(mockRepository.MockUserRepository)
	svc := userService.NewUserService(mockRepo)

	mockRepo.On("FindByID", uint(999)).Return(nil, errors.New("record not found"))

	// Act
	result, err := svc.GetProfile(999)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestUserService_UpdateProfile_Success(t *testing.T) {
	// Arrange
	mockRepo := new(mockRepository.MockUserRepository)
	svc := userService.NewUserService(mockRepo)

	existingUser := &model.Users{
		ID:    1,
		Name:  "Old Name",
		Email: "test@example.com",
	}

	form := &userForm.UpdateProfileForm{
		Name:     "New Name",
		Language: "en",
	}

	mockRepo.On("FindByID", uint(1)).Return(existingUser, nil)
	mockRepo.On("Update", mock.AnythingOfType("*model.Users")).Return(nil)

	// Act
	result, err := svc.UpdateProfile(1, form)

	// Assert
	assert.NoError(t, err)
	assert.Equal(t, "New Name", result.Name)
	assert.Equal(t, "en", result.Language)
	mockRepo.AssertExpectations(t)
}

func TestUserService_UpdateProfile_ValidationError(t *testing.T) {
	// Arrange
	mockRepo := new(mockRepository.MockUserRepository)
	svc := userService.NewUserService(mockRepo)

	form := &userForm.UpdateProfileForm{
		Name:     "A", // Too short
		Language: "en",
	}

	// Act
	result, err := svc.UpdateProfile(1, form)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, result)
}

func TestUserService_DeleteAccount_Success(t *testing.T) {
	// Arrange
	mockRepo := new(mockRepository.MockUserRepository)
	svc := userService.NewUserService(mockRepo)

	mockRepo.On("Delete", uint(1)).Return(nil)

	// Act
	err := svc.DeleteAccount(1)

	// Assert
	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}
