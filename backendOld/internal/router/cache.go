// router/cache_routes.go
package router

import (
	"github.com/gofiber/fiber/v2"

	"mindsteps/internal/auth"
	"mindsteps/internal/cache/handler"
)

// RegisterCacheRoutes нь cache удирдлагын route-уудыг бүртгэнэ
func RegisterCacheRoutes(api fiber.Router) {
	h := handler.NewCacheHandler()

	// Admin эрхтэй байх ёстой
	cache := api.Group("/cache", auth.TokenMiddleware) // auth.AdminMiddleware

	// Cache цэвэрлэх endpoints
	cache.Delete("/clear", h.ClearCache)                 // Бүх cache цэвэрлэх
	cache.Delete("/clear/:prefix", h.ClearCacheByPrefix) // Тодорхой prefix-ийн cache цэвэрлэх
	cache.Post("/clear/batch", h.ClearCacheByPrefixes)   // Олон prefix-ийн cache цэвэрлэх

	// Cache мэдээлэл авах
	cache.Get("/info", h.GetCacheInfo)   // Нийт cache мэдээлэл
	cache.Get("/stats", h.GetCacheStats) // Cache статистик
	cache.Get("/health", h.HealthCheck)  // Health check
}
