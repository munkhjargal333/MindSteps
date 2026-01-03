package repository

import (
	"mindsteps/database/model"
	"time"

	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *model.Users) error
	FindByID(id uint) (*model.Users, error)
	FindByEmail(email string) (*model.Users, error)
	Update(user *model.Users) error
	Delete(id uint) error
	UpdateLastLogin(id uint) error
	UpdatePassword(id uint, hashedPassword string) error
	IncrementLoginCount(id uint) error
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

func (r *userRepo) FindByID(id uint) (*model.Users, error) {
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

func (r *userRepo) Delete(id uint) error {
	now := time.Now()
	return r.db.Model(&model.Users{}).Where("id = ?", id).Update("deleted_at", now).Error
}

func (r *userRepo) UpdateLastLogin(id uint) error {
	now := time.Now()
	return r.db.Model(&model.Users{}).Where("id = ?", id).Update("last_login", now).Error
}

func (r *userRepo) UpdatePassword(id uint, hashedPassword string) error {
	return r.db.Model(&model.Users{}).Where("id = ?", id).Update("password", hashedPassword).Error
}

func (r *userRepo) IncrementLoginCount(id uint) error {
	return r.db.Model(&model.Users{}).Where("id = ?", id).
		UpdateColumn("login_count", gorm.Expr("login_count + ?", 1)).Error
}
