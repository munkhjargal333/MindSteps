package repository

import (
	"errors"
	"mindsteps/database"
	"mindsteps/database/model"

	"github.com/gofiber/fiber/v2/log"
	"gorm.io/gorm"
)

func CreateUser(u *model.Users) error {
	if err := database.DB.Create(u).Error; err != nil {
		log.Errorf("Error creating user: %v", err)
		return err
	}
	return nil
}

func FindUserByID(id uint) *model.Users {
	user := &model.Users{}
	if err := database.DB.Where("id = ? AND is_active = TRUE", id).First(user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		log.Errorf("Error finding user by ID: %v", err)
		return nil
	}
	return user
}

func FindUserByEmail(email string) *model.Users {
	user := &model.Users{}
	if err := database.DB.Where("email = ? AND is_active = TRUE", email).First(user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		log.Errorf("Error finding user by email: %v", err)
		return nil
	}
	return user
}

func ListUsers(limit int, offset int) ([]model.Users, error) {
	var users []model.Users
	if err := database.DB.Where("is_active = TRUE").Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		log.Errorf("Error listing users: %v", err)
		return nil, err
	}
	return users, nil
}

func UpdateUser(u *model.Users) error {
	if err := database.DB.Save(u).Error; err != nil {
		log.Errorf("Error updating user: %v", err)
		return err
	}
	return nil
}

func DeactivateUser(id uint) error {
	if err := database.DB.Model(&model.Users{}).
		Where("id = ?", id).
		Update("is_active", false).Error; err != nil {
		log.Errorf("Error deactivating user: %v", err)
		return err
	}
	return nil
}

func RestoreUser(id uint) error {
	if err := database.DB.Model(&model.Users{}).
		Where("id = ?", id).
		Update("is_active", true).Error; err != nil {
		log.Errorf("Error restoring user: %v", err)
		return err
	}
	return nil
}
