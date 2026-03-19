// ============================================
// repository/lesson.go - Repository Layer
// ============================================
package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
)

type LessonCategoryRepository interface {
	FindAll() ([]model.LessonCategory, error)
	FindByID(id uint) (*model.LessonCategory, error)
	Create(lesson *model.LessonCategory) error
	Update(lesson *model.LessonCategory) error
	Delete(id uint) error
	FindByCategoryID(categoryID uint) ([]model.LessonCategory, error)
	CategoriesList() ([]model.LessonCategory, error)
}

type lessonCateRepo struct {
	db *gorm.DB
}

func NewlessonCateRepository(db *gorm.DB) *lessonCateRepo {
	return &lessonCateRepo{db: db}
}

func (r *lessonCateRepo) FindAll() ([]model.LessonCategory, error) {
	var lessonCategory []model.LessonCategory
	err := r.db.Order("id desc").Find(&lessonCategory).Error
	return lessonCategory, err
}

func (r *lessonCateRepo) FindByID(id uint) (*model.LessonCategory, error) {
	var lessonCategory model.LessonCategory
	err := r.db.First(&lessonCategory, id).Error
	return &lessonCategory, err
}

func (r *lessonCateRepo) Create(lesson *model.LessonCategory) error {
	return r.db.Create(lesson).Error
}

func (r *lessonCateRepo) Update(lessonCategory *model.LessonCategory) error {
	return r.db.Save(lessonCategory).Error
}

func (r *lessonCateRepo) Delete(id uint) error {
	return r.db.Delete(&model.LessonCategory{}, id).Error
}

func (r *lessonCateRepo) FindByCategoryID(categoryID uint) ([]model.LessonCategory, error) {
	var LessonCategory []model.LessonCategory
	err := r.db.Where("category_id = ?", categoryID).
		Order("id desc").
		Find(&LessonCategory).Error
	return LessonCategory, err
}

func (r *lessonCateRepo) CategoriesList() ([]model.LessonCategory, error) {
	var categories []model.LessonCategory
	err := r.db.
		Where("is_active = true").
		Where("parent_id IS NULL").
		Order("sort_order asc, id asc").
		Preload("Children").
		Find(&categories).Error
	return categories, err
}
