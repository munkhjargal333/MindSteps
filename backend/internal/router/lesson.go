// ============================================
// router/lesson_routes.go - Route Registration
// ============================================
package router

import (
	"mindsteps/config"
	"mindsteps/database"
	"mindsteps/internal/auth"
	"mindsteps/internal/lesson/handler"
	"mindsteps/internal/lesson/repository"
	"mindsteps/internal/lesson/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterLessonRoutes(api fiber.Router) {
	// Repository, Service, Handler initialization
	repo := repository.NewLessonRepository(database.DB)
	svc := service.NewLessonService(repo)

	cfg := config.Get().CloudApi
	h := handler.NewLessonHandler(
		svc,
		cfg.BucketName, // R2 bucket name
		cfg.CdnURL,     // CDN URL
	)

	// Public routes
	lessons := api.Group("lessons", auth.TokenMiddleware)
	{
		lessons.Get("/", h.GetAll)
		lessons.Get("/category", h.GetAllCategory)
		lessons.Get("/:id", h.GetByID)
		lessons.Get("/category/:categoryID", h.GetAllLessonsByCategory)
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
