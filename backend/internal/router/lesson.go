// ============================================
// router/lesson_routes.go - Route Registration
// ============================================
package router

import (
	"mindsteps/config"
	"mindsteps/database"
	"mindsteps/internal/auth"
	gamificationRepo "mindsteps/internal/gamification/repository"
	gamificationService "mindsteps/internal/gamification/service"
	"mindsteps/internal/lesson/handler"
	"mindsteps/internal/lesson/repository"
	"mindsteps/internal/lesson/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterLessonRoutes(api fiber.Router) {

	gamificationRepo := gamificationRepo.NewGamificationRepository(database.DB)
	gamificationService := gamificationService.NewGamificationService(gamificationRepo)
	// Repository, Service, Handler initialization
	repo := repository.NewLessonRepository(database.DB)
	svc := service.NewLessonService(repo, gamificationService)

	cfg := config.Get().CloudApi
	h := handler.NewLessonHandler(
		svc,
		cfg.BucketName, // R2 bucket name
		cfg.CdnURL,     // CDN URL
	)

	// Public routes
	lessons := api.Group("lessons", auth.TokenMiddleware)
	{
		// 1. Үндсэн жагсаалт болон шүүлтүүрүүд
		lessons.Get("/", h.GetAll)                    // Бүх хичээл авах
		lessons.Get("/category", h.GetAllCategory)    // Бүх ангиллын жагсаалт (Нэрийг нь цэгцлэв)
		lessons.Post("/complete", h.CompleteLesson)   // Хэрэглэгчийн гүйцэтгэсэн хичээлүүд
		lessons.Get("/parent/:id", h.GetByParent)     // Үндсэн бүлгээр шүүх (ШИНЭ)
		lessons.Get("/category/:id", h.GetByCategory) // Дэд бүлгээр шүүх (САЛГАЖ ӨГӨВ)

		// 2. Ангиллын мэдээлэл

		// 3. Тухайн нэг хичээлийн дэлгэрэнгүй
		lessons.Get("/:id", h.GetByID) // ID-аар нэг хичээл авах
	}

	// Admin routes (authentication required)
	admin := api.Group("/admin/lessons", auth.TokenMiddleware)
	// admin.Use(middleware.AuthRequired()) // Uncomment when auth middleware is ready
	{
		admin.Post("/", h.Create)                         // POST /api/admin/lessons
		admin.Put("/:id", h.Update)                       // PUT /api/admin/lessons/:id
		admin.Delete("/:id", h.Delete)                    // DELETE /api/admin/lessons/:id
		admin.Delete("/:id/thumbnail", h.DeleteThumbnail) // DELETE /api/admin/lessons/:id/thumbnail
		admin.Delete("/:id/media", h.DeleteMedia)         // DELETE /api/admin/lessons/:id/media
	}
}
