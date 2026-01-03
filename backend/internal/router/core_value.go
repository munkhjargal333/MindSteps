package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth"
	"mindsteps/internal/cache"
	"mindsteps/internal/core_value/handler"
	"mindsteps/internal/core_value/repository"
	"mindsteps/internal/core_value/service"
	"time"

	"github.com/gofiber/fiber/v2"
)

func RegisterCoreRoutes(api fiber.Router) {

	coreValueRepo := repository.NewCoreValueRepository(database.DB)
	coreValueService := service.NewCoreValueService(coreValueRepo)
	h := handler.NewCoreValueHandler(coreValueService)

	coreValue := api.Group("/core-values", auth.TokenMiddleware)

	coreValue.Get("/me", h.ListByUserID)

	coreValue.Get("/maslow", cache.NewCacheMiddleware(cache.CacheConfig{
		Expiration: 24 * time.Hour,
		KeyPrefix:  "maslow-levels",
	}), h.MaslowLevelList)

	coreValue.Post("/", h.Create)
	coreValue.Get("/:id", h.GetByID)
	coreValue.Put("/:id", h.Update)
	coreValue.Delete("/:id", h.Delete)
}
