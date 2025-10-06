package mock_repository

import (
	"mindsteps/database/model"

	"github.com/stretchr/testify/mock"
)

// MockUserRepo бол repository.UserRepository интерфэйсийн mock
type MockUserRepo struct {
	mock.Mock
}

func (m *MockUserRepo) Create(user *model.Users) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockUserRepo) GetByID(id uint) (*model.Users, error) {
	args := m.Called(id)
	return args.Get(0).(*model.Users), args.Error(1)
}

func (m *MockUserRepo) GetByEmail(email string) (*model.Users, error) {
	args := m.Called(email)
	return args.Get(0).(*model.Users), args.Error(1)
}

func (m *MockUserRepo) Update(user *model.Users) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockUserRepo) Delete(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockUserRepo) ListAll() ([]model.Users, error) {
	args := m.Called()
	return args.Get(0).([]model.Users), args.Error(1)
}
