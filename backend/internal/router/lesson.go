// ============================================
// router/lesson_routes.go - Route Registration
// ============================================
package router

import (
	"mindsteps/config"
	"mindsteps/database"
	"mindsteps/internal/auth"
	"mindsteps/internal/cache"
	gamificationRepo "mindsteps/internal/gamification/repository"
	gamificationService "mindsteps/internal/gamification/service"
	"mindsteps/internal/lesson/handler"
	"mindsteps/internal/lesson/repository"
	"mindsteps/internal/lesson/service"
	"time"

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
		// 1. Ангилал авах (Энэ нь хамгийн дээр байх ёстой)
		// Cache Key-д URL-ийг оруулах нь зөв (Query params-аас хамаарч өөр cache үүснэ)
		lessons.Get("/category", cache.NewCacheMiddleware(cache.CacheConfig{
			Expiration: 24 * time.Hour,
			KeyPrefix:  "cat-list",
		}), h.GetAllCategory)

		// 2. Үндсэн бүлгээр шүүх
		lessons.Get("/parent/:id", cache.NewCacheMiddleware(cache.CacheConfig{
			Expiration: 24 * time.Hour,
			KeyPrefix:  "parent-list",
		}), h.GetByParent)

		// 3. Дэд бүлгээр шүүх
		lessons.Get("/category/:id", cache.NewCacheMiddleware(cache.CacheConfig{
			Expiration: 24 * time.Hour,
			KeyPrefix:  "subcat-list",
		}), h.GetByCategory)

		// 4. Пост хүсэлтүүд
		lessons.Post("/complete", h.CompleteLesson)

		// 5. Ганц хичээл авах (ID-аар)
		// Жич: h.GetAll-ийг эндээс хассан
		lessons.Get("/:id", cache.NewCacheMiddleware(cache.CacheConfig{
			Expiration: 24 * time.Hour,
			KeyPrefix:  "lesson-detail",
		}), h.GetByID)

		// 6. Бүх хичээл авах (Хамгийн доор байх нь аюулгүй)
		lessons.Get("/", cache.NewCacheMiddleware(cache.CacheConfig{
			Expiration: 24 * time.Hour,
			KeyPrefix:  "lessons-main",
		}), h.GetAll)
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
