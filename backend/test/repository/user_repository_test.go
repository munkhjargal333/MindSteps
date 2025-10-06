package repository_test

import (
	"mindsteps/config"
	"mindsteps/database"
	"mindsteps/database/model"
	"mindsteps/internal/user/repository"
	"testing"

	logLevel "gorm.io/gorm/logger"

	"github.com/stretchr/testify/assert"
)

func setupTestRepo(t *testing.T) (repository.UserRepository, func()) {
	config.MustLoad()
	database.MustConnect(logLevel.Info) //

	db := database.DB
	repo := repository.NewUserRepository(db)

	// Cleanup function: rollback transaction
	cleanup := func() {
		db.Rollback()
	}

	return repo, cleanup
}

func TestUserRepository_Create(t *testing.T) {
	repo, cleanup := setupTestRepo(t)
	defer cleanup() // Тест дуусахад rollback

	user := &model.Users{
		Name:     "Transactional User",
		Email:    "trans1@example.com",
		Password: "hashedpassword",
	}

	err := repo.Create(user)
	assert.NoError(t, err)
	assert.NotZero(t, user.ID)
}
