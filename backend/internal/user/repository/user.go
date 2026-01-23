package repository

import (
	"mindsteps/database/model"
	"time"

	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *model.Users) error
	FindByID(id string) (*model.Users, error)
	FindByEmail(email string) (*model.Users, error)
	Update(user *model.Users) error
	Delete(id string) error
	UpdateLastLogin(id string) error
	UpdatePassword(id string, hashedPassword string) error
	IncrementLoginCount(id string) error
}

type userRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepo{db: db}
}

func (r *userRepo) Create(user *model.Users) error {
	return r.db.Create(user).Error
}

func (r *userRepo) FindByID(id string) (*model.Users, error) {
	var user model.Users
	if err := r.db.Where("id = ? AND deleted_at IS NULL", id).Preload("Gamification").Preload("Gamification.Level").First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) FindByEmail(email string) (*model.Users, error) {
	var user model.Users
	if err := r.db.Where("email = ? AND deleted_at IS NULL", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) Update(user *model.Users) error {
	return r.db.Save(user).Error
}

func (r *userRepo) Delete(id string) error {
	now := time.Now()
	return r.db.Model(&model.Users{}).Where("id = ?", id).Update("deleted_at", now).Error
}

func (r *userRepo) UpdateLastLogin(id string) error {
	now := time.Now()
	return r.db.Model(&model.Users{}).Where("id = ?", id).Update("last_login", now).Error
}

func (r *userRepo) UpdatePassword(id string, hashedPassword string) error {
	return r.db.Model(&model.Users{}).Where("id = ?", id).Update("password", hashedPassword).Error
}

func (r *userRepo) IncrementLoginCount(id string) error {
	return r.db.Model(&model.Users{}).Where("id = ?", id).
		UpdateColumn("login_count", gorm.Expr("login_count + ?", 1)).Error
}
