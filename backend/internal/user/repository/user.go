package repository

import (
	"mindsteps/database"
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *model.Users) error
	GetByID(id uint) (*model.Users, error)
	GetByEmail(email string) (*model.Users, error)
	Update(user *model.Users) error
	Delete(id uint) error
	ListAll() ([]model.Users, error)
}

type userRepo struct {
	db *gorm.DB
}

func NewUserRepository() UserRepository {
	return &userRepo{db: database.DB}
}

func (r *userRepo) Create(user *model.Users) error {
	return r.db.Create(user).Error
}

func (r *userRepo) GetByID(id uint) (*model.Users, error) {
	var user model.Users
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) GetByEmail(email string) (*model.Users, error) {
	var user model.Users
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) Update(user *model.Users) error {
	return r.db.Save(user).Error
}

func (r *userRepo) Delete(id uint) error {
	return r.db.Delete(&model.Users{}, id).Error
}

func (r *userRepo) ListAll() ([]model.Users, error) {
	var users []model.Users
	if err := r.db.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}
