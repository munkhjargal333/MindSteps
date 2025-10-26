package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type LessonRepository interface {
	Create(lesson *model.Lessons) error
	FindAll() ([]model.Lessons, error)
	FindByID(id uint) (*model.Lessons, error)
	Update(lesson *model.Lessons) error
	Delete(id uint) error
}

type lessonRepo struct {
	db *gorm.DB
}

func NewLessonRepository(db *gorm.DB) LessonRepository {
	return &lessonRepo{db: db}
}

func (r *lessonRepo) Create(lesson *model.Lessons) error {
	return r.db.Create(lesson).Error
}

func (r *lessonRepo) FindAll() ([]model.Lessons, error) {
	var lessons []model.Lessons
	err := r.db.Order("id desc").Find(&lessons).Error
	return lessons, err
}

func (r *lessonRepo) FindByID(id uint) (*model.Lessons, error) {
	var lesson model.Lessons
	err := r.db.First(&lesson, id).Error
	return &lesson, err
}

func (r *lessonRepo) Update(lesson *model.Lessons) error {
	return r.db.Save(lesson).Error
}

func (r *lessonRepo) Delete(id uint) error {
	return r.db.Delete(&model.Lessons{}, id).Error
}
