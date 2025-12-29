// ============================================
// handler/lesson.go - HTTP Handlers
// ============================================
package handler

import (
	"fmt"
	"mime/multipart"
	"mindsteps/internal/auth"
	"mindsteps/internal/lesson/form"
	myform "mindsteps/internal/lesson/form"
	"mindsteps/internal/lesson/service"
	"mindsteps/internal/shared"
	"mindsteps/pkg/cloudflare"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type LessonHandler struct {
	service    service.LessonService
	bucketName string
	cdnURL     string
}

func NewLessonHandler(
	service service.LessonService,
	bucketName string,
	cdnURL string,
) *LessonHandler {
	return &LessonHandler{
		service:    service,
		bucketName: bucketName,
		cdnURL:     cdnURL,
	}
}

// uploadFile хэрэгслийн файл upload хийх функц
func (h *LessonHandler) uploadFile(_ *fiber.Ctx, file *multipart.FileHeader, prefix string) (string, error) {
	// Файлын өргөтгөл шалгах
	ext := filepath.Ext(file.Filename)
	allowedExts := map[string]bool{
		".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true,
		".mp4": true, ".webm": true, ".mov": true,
		".mp3": true, ".wav": true, ".ogg": true,
		".pdf": true, ".doc": true, ".docx": true,
	}

	if !allowedExts[strings.ToLower(ext)] {
		return "", fmt.Errorf("зөвшөөрөгдөөгүй файлын өргөтгөл: %s", ext)
	}

	// Файлын хэмжээ шалгах (10MB)
	if file.Size > 100*1024*1024 {
		return "", fmt.Errorf("файлын хэмжээ хэтэрсэн (максимум 100MB)")
	}

	// Файл нээх
	fileContent, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("файл нээхэд алдаа гарлаа: %w", err)
	}
	defer fileContent.Close()

	// Unique filename үүсгэх
	uniqueFilename := fmt.Sprintf("%s_%s_%s%s",
		prefix,
		time.Now().Format("20060102_150405"),
		uuid.New().String()[:8],
		ext,
	)

	// R2 руу upload хийх
	objectName := fmt.Sprintf("lessons/%s", uniqueFilename)
	uploadURL, err := cloudflare.PutObject(
		h.bucketName,
		objectName,
		file.Header.Get("Content-Type"),
		fileContent,
		file.Size,
	)
	if err != nil {
		return "", fmt.Errorf("файл upload хийхэд алдаа гарлаа: %w", err)
	}

	// CDN URL буцаах
	if h.cdnURL != "" {
		return fmt.Sprintf("%s/%s", strings.TrimRight(h.cdnURL, "/"), objectName), nil
	}

	return uploadURL, nil
}

// deleteFile - файл устгах
func (h *LessonHandler) deleteFile(fileURL string) error {
	if fileURL == "" {
		return nil
	}

	// URL-аас object name-г салгаж авах
	parts := strings.Split(fileURL, "/lessons/")
	if len(parts) < 2 {
		return nil // URL буруу байвал алдаа гаргахгүй
	}

	objectName := fmt.Sprintf("lessons/%s", parts[1])
	return cloudflare.DeleteObject(h.bucketName, objectName)
}

// 1. Бүх хичээлийг авах (Шүүлтүүргүй)
// GET /lessons?page=1&limit=10
func (h *LessonHandler) GetAll(c *fiber.Ctx) error {
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	lessons, count, err := h.service.GetAllLessons(page, limit)
	if err != nil {
		return shared.ResponseBadRequest(c, "Хичээл татахад алдаа гарлаа")
	}

	return c.JSON(fiber.Map{
		"lessons": lessons, // Frontend response.lessons гэж хүлээж авч байгаа
		"total":   count,
		"page":    page,
		"limit":   limit,
	})
}

// 2. Үндсэн бүлгээр (Parent) шүүж авах
// GET /lessons/parent/:id?page=1&limit=10
func (h *LessonHandler) GetByParent(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return shared.ResponseBadRequest(c, "Буруу ангиллын ID")
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	lessons, count, err := h.service.GetLessonsByParent(uint(id), page, limit)
	if err != nil {
		return shared.ResponseBadRequest(c, "Хичээл татахад алдаа гарлаа")
	}

	return c.JSON(fiber.Map{
		"lessons": lessons,
		"total":   count,
	})
}

// 3. Дэд бүлгээр (Category) шүүж авах
// GET /lessons/category/:id?page=1&limit=10
func (h *LessonHandler) GetByCategory(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return shared.ResponseBadRequest(c, "Буруу ангиллын ID")
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	lessons, count, err := h.service.GetLessonsByCategory(uint(id), page, limit)
	if err != nil {
		return shared.ResponseBadRequest(c, "Хичээл татахад алдаа гарлаа")
	}

	return c.JSON(fiber.Map{
		"lessons": lessons,
		"total":   count,
	})
}

// GET /lessons/:id
func (h *LessonHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Буруу ID")
	}

	lesson, err := h.service.GetLessonByID(uint(id))
	if err != nil {
		return shared.ResponseNotFound(c)
	}
	return c.JSON(lesson)
}

// GET /lessons/category
func (h *LessonHandler) GetAllCategory(c *fiber.Ctx) error {
	categories, err := h.service.GetAllCategory()
	if err != nil {
		return shared.ResponseBadRequest(c, "Категори татахад алдаа гарлаа")
	}
	return c.JSON(categories)
}

func (h *LessonHandler) CompleteLesson(c *fiber.Ctx) error {
	var f form.CompleteLessonForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)

	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	if err := h.service.CompleteLesson(tokenInfo.UserID, &f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"message": "Хичээл дуусгалаа",
	})
}

// GET /lessons/category/:categoryID
// func (h *LessonHandler) GetAllLessonsByCategory(c *fiber.Ctx) error {
// 	categoryID, err := strconv.Atoi(c.Params("categoryID"))
// 	if err != nil {
// 		return shared.ResponseBadRequest(c, "Буруу категорийн ID")
// 	}

// 	lessons, err := h.service.GetAllLessonsByCategory(uint(categoryID))
// 	if err != nil {
// 		return shared.ResponseBadRequest(c, "Хичээл татахад алдаа гарлаа")
// 	}
// 	return c.JSON(lessons)
// }

// POST /lessons
func (h *LessonHandler) Create(c *fiber.Ctx) error {
	// Parse multipart form
	form, err := c.MultipartForm()
	if err != nil {
		return shared.ResponseBadRequest(c, "Форм өгөгдөл буруу байна")
	}

	// Helper to get form value
	getValue := func(key string) string {
		if values := form.Value[key]; len(values) > 0 {
			return values[0]
		}
		return ""
	}

	// Parse category_id
	categoryID, err := strconv.Atoi(getValue("category_id"))
	if err != nil || categoryID == 0 {
		return shared.ResponseBadRequest(c, "category_id шаардлагатай")
	}

	// Create form struct
	var f myform.LessonForm
	f.Title = getValue("title")
	f.CategoryID = uint(categoryID)
	f.Slug = getValue("slug")
	f.Description = getValue("description")
	f.Content = getValue("content")
	f.LessonType = getValue("lesson_type")
	f.DifficultyLevel = getValue("difficulty_level")
	// f.RelatedValueKeywords = getValue("related_value_keywords")
	// f.RelatedEmotionKeywords = getValue("related_emotion_keywords")
	f.RelatedValueKeywords = "{}"
	f.RelatedEmotionKeywords = "{}"

	// Parse integers with defaults
	if val := getValue("required_level"); val != "" {
		f.RequiredLevel, _ = strconv.Atoi(val)
	}
	if val := getValue("estimated_duration"); val != "" {
		f.EstimatedDuration, _ = strconv.Atoi(val)
	}
	if val := getValue("points_reward"); val != "" {
		f.PointsReward, _ = strconv.Atoi(val)
	}
	if val := getValue("sort_order"); val != "" {
		f.SortOrder, _ = strconv.Atoi(val)
	}

	if val := getValue("parent_id"); val != "" {
		parentIDInt, _ := strconv.Atoi(val) // string → int
		parentID := uint(parentIDInt)       // int → uint
		f.ParentID = &parentID              // pointer онооно
	}

	// Parse booleans
	f.IsPremium = getValue("is_premium") == "true"
	f.IsPublished = getValue("is_published") == "true"

	// Handle thumbnail upload
	thumbnailURL := getValue("thumbnail_url")
	if thumbnailFile := form.File["thumbnail"]; len(thumbnailFile) > 0 {
		uploadedURL, err := h.uploadFile(c, thumbnailFile[0], "thumbnail")
		if err != nil {
			return shared.ResponseBadRequest(c, "Зураг upload хийхэд алдаа: "+err.Error())
		}
		thumbnailURL = uploadedURL
	}
	f.ThumbnailURL = thumbnailURL

	// Handle media upload (video/audio)
	mediaURL := getValue("media_url")
	if mediaFile := form.File["media"]; len(mediaFile) > 0 {
		uploadedURL, err := h.uploadFile(c, mediaFile[0], "media")
		if err != nil {
			return shared.ResponseBadRequest(c, "Медиа upload хийхэд алдаа: "+err.Error())
		}
		mediaURL = uploadedURL
	}
	f.MediaURL = mediaURL

	// Handle tags array
	if tags := form.Value["tags[]"]; len(tags) > 0 {
		f.Tags = strings.Join(tags, ",")
	} else if tagsStr := getValue("tags"); tagsStr != "" {
		f.Tags = tagsStr
	}

	// Create lesson
	lesson, err := h.service.CreateLesson(f)
	if err != nil {
		// Файлуудыг устгах хэрэв хичээл үүсгэхэд алдаа гарсан бол
		if thumbnailURL != "" {
			h.deleteFile(thumbnailURL)
		}
		if mediaURL != "" {
			h.deleteFile(mediaURL)
		}
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(lesson)
}

// PUT /lessons/:id
func (h *LessonHandler) Update(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Буруу ID")
	}

	// Өмнөх хичээлийг авах (файлуудыг устгахын тулд)
	oldLesson, err := h.service.GetLessonByID(uint(id))
	if err != nil {
		return shared.ResponseNotFound(c)
	}

	// Parse multipart form
	form, err := c.MultipartForm()
	if err != nil {
		return shared.ResponseBadRequest(c, "Форм өгөгдөл буруу байна")
	}

	getValue := func(key string) string {
		if values := form.Value[key]; len(values) > 0 {
			return values[0]
		}
		return ""
	}

	// Parse category_id
	categoryID, err := strconv.Atoi(getValue("category_id"))
	if err != nil || categoryID == 0 {
		return shared.ResponseBadRequest(c, "category_id шаардлагатай")
	}

	var f myform.LessonForm

	f.Title = getValue("title")
	f.CategoryID = uint(categoryID)
	f.Slug = getValue("slug")
	f.Description = getValue("description")
	f.Content = getValue("content")
	f.LessonType = getValue("lesson_type")
	f.DifficultyLevel = getValue("difficulty_level")
	// f.RelatedValueKeywords = getValue("related_value_keywords")
	// f.RelatedEmotionKeywords = getValue("related_emotion_keywords")
	f.RelatedValueKeywords = "{}"
	f.RelatedEmotionKeywords = "{}"

	if val := getValue("required_level"); val != "" {
		f.RequiredLevel, _ = strconv.Atoi(val)
	}
	if val := getValue("estimated_duration"); val != "" {
		f.EstimatedDuration, _ = strconv.Atoi(val)
	}
	if val := getValue("points_reward"); val != "" {
		f.PointsReward, _ = strconv.Atoi(val)
	}
	if val := getValue("sort_order"); val != "" {
		f.SortOrder, _ = strconv.Atoi(val)
	}
	if val := getValue("parent_id"); val != "" {
		parentIDInt, _ := strconv.Atoi(val) // string → int
		parentID := uint(parentIDInt)       // int → uint
		f.ParentID = &parentID              // pointer онооно
	}

	f.IsPremium = getValue("is_premium") == "true"
	f.IsPublished = getValue("is_published") == "true"

	// Handle thumbnail upload/update
	thumbnailURL := oldLesson.ThumbnailURL
	if thumbnailFile := form.File["thumbnail"]; len(thumbnailFile) > 0 {
		uploadedURL, err := h.uploadFile(c, thumbnailFile[0], "thumbnail")
		if err != nil {
			return shared.ResponseBadRequest(c, "Зураг upload хийхэд алдаа: "+err.Error())
		}
		// Хуучин файлыг устгах
		if oldLesson.ThumbnailURL != "" {
			h.deleteFile(oldLesson.ThumbnailURL)
		}
		thumbnailURL = uploadedURL
	} else if newURL := getValue("thumbnail_url"); newURL != "" {
		thumbnailURL = newURL
	}
	f.ThumbnailURL = thumbnailURL

	// Handle media upload/update
	mediaURL := oldLesson.MediaURL
	if mediaFile := form.File["media"]; len(mediaFile) > 0 {
		uploadedURL, err := h.uploadFile(c, mediaFile[0], "media")
		if err != nil {
			return shared.ResponseBadRequest(c, "Медиа upload хийхэд алдаа: "+err.Error())
		}
		// Хуучин файлыг устгах
		if oldLesson.MediaURL != "" {
			h.deleteFile(oldLesson.MediaURL)
		}
		mediaURL = uploadedURL
	} else if newURL := getValue("media_url"); newURL != "" {
		mediaURL = newURL
	}
	f.MediaURL = mediaURL

	// Handle tags
	if tags := form.Value["tags[]"]; len(tags) > 0 {
		f.Tags = strings.Join(tags, ",")
	} else if tagsStr := getValue("tags"); tagsStr != "" {
		f.Tags = tagsStr
	}

	// Update lesson
	lesson, err := h.service.UpdateLesson(uint(id), f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(lesson)
}

// DELETE /lessons/:id
func (h *LessonHandler) Delete(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Буруу ID")
	}

	// Хичээлийг авч файлуудыг устгах
	lesson, err := h.service.GetLessonByID(uint(id))
	if err != nil {
		return shared.ResponseNotFound(c)
	}

	// Файлуудыг устгах
	if lesson.ThumbnailURL != "" {
		h.deleteFile(lesson.ThumbnailURL)
	}

	if lesson.MediaURL != "" {
		h.deleteFile(lesson.MediaURL)
	}

	// Хичээлийг устгах
	if err := h.service.DeleteLesson(uint(id)); err != nil {
		return shared.ResponseBadRequest(c, "Хичээл устгахад алдаа гарлаа")
	}

	return c.JSON(fiber.Map{
		"message": "Хичээл амжилттай устгагдлаа",
	})
}

// DELETE /lessons/:id/thumbnail - Зөвхөн зураг устгах
func (h *LessonHandler) DeleteThumbnail(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Буруу ID")
	}

	lesson, err := h.service.GetLessonByID(uint(id))
	if err != nil {
		return shared.ResponseNotFound(c)
	}

	if lesson.ThumbnailURL != "" {
		if err := h.deleteFile(lesson.ThumbnailURL); err != nil {
			return shared.ResponseBadRequest(c, "Зураг устгахад алдаа гарлаа")
		}
	}

	// Database-д update хийх
	var f form.LessonForm
	f.Title = lesson.Title
	f.CategoryID = uint(lesson.CategoryID)
	f.ThumbnailURL = "" // Зургийг хоослох
	f.MediaURL = lesson.MediaURL
	f.Description = lesson.Description
	f.Content = lesson.Content
	f.LessonType = lesson.LessonType
	f.DifficultyLevel = lesson.DifficultyLevel
	f.RequiredLevel = lesson.RequiredLevel
	f.EstimatedDuration = lesson.EstimatedDuration
	f.PointsReward = lesson.PointsReward
	f.IsPremium = lesson.IsPremium
	f.IsPublished = lesson.IsPublished
	f.SortOrder = lesson.SortOrder

	_, err = h.service.UpdateLesson(uint(id), f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"message": "Зураг амжилттай устгагдлаа",
	})
}

// DELETE /lessons/:id/media - Зөвхөн медиа устгах
func (h *LessonHandler) DeleteMedia(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Буруу ID")
	}

	lesson, err := h.service.GetLessonByID(uint(id))
	if err != nil {
		return shared.ResponseNotFound(c)
	}

	if lesson.MediaURL != "" {
		if err := h.deleteFile(lesson.MediaURL); err != nil {
			return shared.ResponseBadRequest(c, "Медиа устгахад алдаа гарлаа")
		}
	}

	// Database-д update хийх
	var f form.LessonForm
	f.Title = lesson.Title
	f.CategoryID = uint(lesson.CategoryID)
	f.ThumbnailURL = lesson.ThumbnailURL
	f.MediaURL = "" // Медиаг хоослох
	f.Description = lesson.Description
	f.Content = lesson.Content
	f.LessonType = lesson.LessonType
	f.DifficultyLevel = lesson.DifficultyLevel
	f.RequiredLevel = lesson.RequiredLevel
	f.EstimatedDuration = lesson.EstimatedDuration
	f.PointsReward = lesson.PointsReward
	f.IsPremium = lesson.IsPremium
	f.IsPublished = lesson.IsPublished
	f.SortOrder = lesson.SortOrder

	_, err = h.service.UpdateLesson(uint(id), f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"message": "Медиа амжилттай устгагдлаа",
	})
}
