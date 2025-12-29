// ============================================
// repository/lesson.go - Repository Layer
// ============================================
package repository

import (
	"mindsteps/database/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type LessonRepository interface {
	Create(lesson *model.Lessons) error
	FindByID(id uint) (*model.Lessons, error)
	Update(lesson *model.Lessons) error
	Delete(id uint) error
	CategoriesList() ([]model.LessonCategory, error)
	FindAll(page, limit int) ([]model.Lessons, int64, error)
	FindByParentCategoryID(parentID uint, page, limit int) ([]model.Lessons, int64, error)
	FindByCategoryID(categoryID uint, page, limit int) ([]model.Lessons, int64, error)
	UpsertProgress(p *model.UserLessonProgress) error
	GetProgress(userID, lessonID uint) (*model.UserLessonProgress, error)
	UpsertProgressMap(userID uint, lessonID uint, updates map[string]interface{}) error
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

// 1. Бүх хичээлийг авах + Нийт тоо
func (r *lessonRepo) FindAll(page, limit int) ([]model.Lessons, int64, error) {
	var lessons []model.Lessons
	var total int64

	r.db.Model(&model.Lessons{}).Count(&total)

	err := r.db.Preload("Category").
		Limit(limit).
		Offset((page - 1) * limit).
		Order("id desc").
		Find(&lessons).Error

	return lessons, total, err
}

// 2. Үндсэн бүлгээр (Parent) шүүх + Нийт тоо
func (r *lessonRepo) FindByParentCategoryID(parentID uint, page, limit int) ([]model.Lessons, int64, error) {
	var lessons []model.Lessons
	var total int64

	// Шүүлтүүртэй Count
	baseQuery := r.db.Model(&model.Lessons{}).
		Joins("JOIN mindstep.lesson_categories ON mindstep.lesson_categories.id = lessons.category_id").
		Where("mindstep.lesson_categories.parent_id = ?", parentID)

	baseQuery.Count(&total)

	// Шүүлтүүртэй Data
	err := baseQuery.Preload("Category").
		Limit(limit).
		Offset((page - 1) * limit).
		Order("lessons.id desc").
		Find(&lessons).Error

	return lessons, total, err
}

// 3. Дэд бүлгээр (Category) шүүх + Нийт тоо
func (r *lessonRepo) FindByCategoryID(categoryID uint, page, limit int) ([]model.Lessons, int64, error) {
	var lessons []model.Lessons
	var total int64

	query := r.db.Model(&model.Lessons{}).Where("category_id = ?", categoryID)

	query.Count(&total)

	err := query.Preload("Category").
		Limit(limit).
		Offset((page - 1) * limit).
		Order("id desc").
		Find(&lessons).Error

	return lessons, total, err
}

func (r *lessonRepo) FindByID(id uint) (*model.Lessons, error) {
	var lesson model.Lessons
	err := r.db.First(&lesson, id).Error
	return &lesson, err
}

func (r *lessonRepo) UserLessonProgress(userID, lessonID uint) (*model.UserLessonProgress, error) {
	var progress model.UserLessonProgress
	err := r.db.Where("user_id = ? AND lesson_id = ?", userID, lessonID).First(&progress).Error
	return &progress, err
}

func (r *lessonRepo) UpsertProgressMap(userID uint, lessonID uint, updates map[string]interface{}) error {
	var progress model.UserLessonProgress

	// FirstOrCreate нь user_id, lesson_id-аар хайна.
	// Хэрэв байвал Updates(updates) хийнэ. Байхгүй бол үүсгэнэ.
	return r.db.Where("user_id = ? AND lesson_id = ?", userID, lessonID).
		FirstOrCreate(&progress).
		Updates(updates).Error
}

func (r *lessonRepo) Update(lesson *model.Lessons) error {
	return r.db.Save(lesson).Error
}

func (r *lessonRepo) Delete(id uint) error {
	return r.db.Delete(&model.Lessons{}, id).Error
}

func (r *lessonRepo) CategoriesList() ([]model.LessonCategory, error) {
	var categories []model.LessonCategory
	err := r.db.
		Where("is_active = true").
		Where("parent_id IS NULL").
		Order("sort_order asc, id asc").
		Preload("Children").
		Find(&categories).Error
	return categories, err
}

func (r *lessonRepo) UpsertProgress(p *model.UserLessonProgress) error {
	// Save() нь ID-аар нь хайж байвал Update, байхгүй бол Create хийдэг
	return r.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}, {Name: "lesson_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"progress_percentage", "rating", "review_text", "time_spent"}),
	}).Create(p).Error
}

func (r *lessonRepo) GetProgress(userID, lessonID uint) (*model.UserLessonProgress, error) {
	var progress model.UserLessonProgress
	err := r.db.Where("user_id = ? AND lesson_id = ?", userID, lessonID).First(&progress).Error
	return &progress, err
}
