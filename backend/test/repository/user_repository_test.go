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
	database.MustConnect(logLevel.Info)

	tx := database.DB.Begin()

	repo := repository.NewUserRepository(tx)

	cleanup := func() {
		tx.Rollback()
	}

	return repo, cleanup
}

func TestUserRepository_Create(t *testing.T) {
	repo, cleanup := setupTestRepo(t)
	defer cleanup()
	user := &model.Users{
		Name:     "Transactional User",
		Email:    "trans1@example.com",
		Password: "hashedpassword",
	}

	err := repo.Create(user)
	assert.NoError(t, err)
	assert.NotZero(t, user.ID)
}
