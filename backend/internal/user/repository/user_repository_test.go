package repository

import (
	"regexp"
	"testing"

	"mindsteps/database/model"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func setupMockDB(t *testing.T) (*gorm.DB, sqlmock.Sqlmock, func()) {
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %v", err)
	}

	dialector := postgres.New(postgres.Config{
		Conn:                 mockDB,
		PreferSimpleProtocol: true,
	})

	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open gorm db: %v", err)
	}

	cleanup := func() { mockDB.Close() }
	return db, mock, cleanup
}

func TestUserRepository_Create(t *testing.T) {
	db, mock, cleanup := setupMockDB(t)
	defer cleanup()

	repo := &userRepo{db: db}

	user := &model.Users{ID: 1, Email: "test@example.com", Name: "Test User"}

	mock.ExpectBegin()
	mock.ExpectQuery(regexp.QuoteMeta(
		`INSERT INTO "users" ("id","email","name") VALUES ($1,$2,$3) RETURNING "id"`)).
		WithArgs(user.ID, user.Email, user.Name).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(user.ID))
	mock.ExpectCommit()

	err := repo.Create(user)
	assert.NoError(t, err)
}

func TestUserRepository_GetByID(t *testing.T) {
	db, mock, cleanup := setupMockDB(t)
	defer cleanup()

	repo := &userRepo{db: db}
	userID := uint(1)
	expectedEmail := "test@example.com"

	rows := sqlmock.NewRows([]string{"id", "email", "name"}).
		AddRow(userID, expectedEmail, "Test User")

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users" WHERE "users"."id" = $1 ORDER BY "users"."id" LIMIT 1`)).
		WithArgs(userID).WillReturnRows(rows)

	user, err := repo.GetByID(userID)
	assert.NoError(t, err)
	assert.Equal(t, expectedEmail, user.Email)
}

func TestUserRepository_GetByEmail(t *testing.T) {
	db, mock, cleanup := setupMockDB(t)
	defer cleanup()

	repo := &userRepo{db: db}
	email := "test@example.com"

	rows := sqlmock.NewRows([]string{"id", "email", "name"}).
		AddRow(1, email, "Test User")

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users" WHERE email = $1 ORDER BY "users"."id" LIMIT 1`)).
		WithArgs(email).WillReturnRows(rows)

	user, err := repo.GetByEmail(email)
	assert.NoError(t, err)
	assert.Equal(t, email, user.Email)
}

func TestUserRepository_Update(t *testing.T) {
	db, mock, cleanup := setupMockDB(t)
	defer cleanup()

	repo := &userRepo{db: db}
	user := &model.Users{ID: 1, Email: "test@example.com", Name: "Updated Name"}

	mock.ExpectBegin()
	mock.ExpectExec(regexp.QuoteMeta(
		`UPDATE "users" SET "email"=$1,"name"=$2 WHERE "id" = $3`)).
		WithArgs(user.Email, user.Name, user.ID).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	err := repo.Update(user)
	assert.NoError(t, err)
}

func TestUserRepository_Delete(t *testing.T) {
	db, mock, cleanup := setupMockDB(t)
	defer cleanup()

	repo := &userRepo{db: db}
	userID := uint(1)

	mock.ExpectBegin()
	mock.ExpectExec(regexp.QuoteMeta(`DELETE FROM "users" WHERE "users"."id" = $1`)).
		WithArgs(userID).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	err := repo.Delete(userID)
	assert.NoError(t, err)
}

func TestUserRepository_ListAll(t *testing.T) {
	db, mock, cleanup := setupMockDB(t)
	defer cleanup()

	repo := &userRepo{db: db}

	rows := sqlmock.NewRows([]string{"id", "email", "name"}).
		AddRow(1, "a@example.com", "User A").
		AddRow(2, "b@example.com", "User B")

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users"`)).
		WillReturnRows(rows)

	users, err := repo.ListAll()
	assert.NoError(t, err)
	assert.Len(t, users, 2)
}
