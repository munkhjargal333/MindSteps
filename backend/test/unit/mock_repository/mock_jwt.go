package mock_repository

import (
	"mindsteps/internal/auth"
	"time"
)

type MockGJWT struct{}

func (m *MockGJWT) GenerateToken(claims *auth.Token, expiresMinut time.Duration) (string, error) {
	return "mocked-token", nil
}

func (m *MockGJWT) ReadToken(token string) (*auth.Token, error) {
	return &auth.Token{UserID: 1}, nil
}
