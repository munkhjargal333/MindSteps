package handler

import (
	"log"
	"mindsteps/internal/cache/service"
	"mindsteps/internal/shared"

	"github.com/gofiber/fiber/v2"
)

type CacheHandler struct {
	service *service.CacheService
	logger  *log.Logger
}

func NewCacheHandler() *CacheHandler {
	return &CacheHandler{
		service: service.NewCacheService(log.Default()),
		logger:  log.Default(),
	}
}

// ClearCache нь бүх cache цэвэрлэх
func (h *CacheHandler) ClearCache(c *fiber.Ctx) error {
	result, err := h.service.InvalidateAll()
	if err != nil {
		h.logger.Printf("Cache цэвэрлэх алдаа: %v", err)
		return shared.ResponseErr(c, "Cache цэвэрлэх явцад алдаа гарлаа")
	}

	return shared.Response(c, fiber.Map{
		"message":       "Бүх cache амжилттай цэвэрлэгдлээ",
		"deleted_count": result.DeletedCount,
		"failed_count":  result.FailedCount,
		"duration_ms":   result.Duration.Milliseconds(),
	})
}

// ClearCacheByPrefix нь prefix-ээр cache цэвэрлэх
func (h *CacheHandler) ClearCacheByPrefix(c *fiber.Ctx) error {
	prefix := c.Params("prefix")
	if prefix == "" {
		return shared.ResponseBadRequest(c, "Prefix оруулна уу")
	}

	result, err := h.service.InvalidateByPrefix(prefix)
	if err != nil {
		h.logger.Printf("Cache цэвэрлэх алдаа (prefix: %s): %v", prefix, err)
		return shared.ResponseErr(c, "Cache цэвэрлэх явцад алдаа гарлаа")
	}

	return shared.Response(c, fiber.Map{
		"message":       "Cache амжилттай цэвэрлэгдлээ",
		"prefix":        prefix,
		"deleted_count": result.DeletedCount,
		"failed_count":  result.FailedCount,
		"duration_ms":   result.Duration.Milliseconds(),
	})
}

// GetCacheInfo нь cache-ийн ерөнхий мэдээлэл авах
func (h *CacheHandler) GetCacheInfo(c *fiber.Ctx) error {
	stats, err := h.service.GetStats()
	if err != nil {
		h.logger.Printf("Cache мэдээлэл авах алдаа: %v", err)
		return shared.ResponseErr(c, "Cache мэдээлэл авах явцад алдаа гарлаа")
	}

	return shared.Response(c, fiber.Map{
		"cache_info": stats,
	})
}

// GetCacheStats нь дэлгэрэнгүй cache статистик авах
func (h *CacheHandler) GetCacheStats(c *fiber.Ctx) error {
	stats, err := h.service.GetStats()
	if err != nil {
		h.logger.Printf("Cache статистик авах алдаа: %v", err)
		return shared.ResponseErr(c, "Cache статистик авах явцад алдаа гарлаа")
	}

	// Health check хийх
	healthErr := h.service.HealthCheck()
	isHealthy := healthErr == nil

	return shared.Response(c, fiber.Map{
		"statistics": stats,
		"health": fiber.Map{
			"is_healthy": isHealthy,
			"status":     map[bool]string{true: "healthy", false: "unhealthy"}[isHealthy],
		},
	})
}

// ClearCacheByPrefixes нь олон prefix-ээр cache цэвэрлэх
func (h *CacheHandler) ClearCacheByPrefixes(c *fiber.Ctx) error {
	var req struct {
		Prefixes []string `json:"prefixes" validate:"required,min=1"`
	}

	if err := c.BodyParser(&req); err != nil {
		return shared.ResponseBadRequest(c, "Буруу өгөгдөл")
	}

	if len(req.Prefixes) == 0 {
		return shared.ResponseBadRequest(c, "Prefix жагсаалт хоосон байна")
	}

	result, err := h.service.InvalidateByPrefixes(req.Prefixes)
	if err != nil {
		h.logger.Printf("Олон prefix-ээр cache цэвэрлэх алдаа: %v", err)
		return shared.ResponseErr(c, "Cache цэвэрлэх явцад алдаа гарлаа")
	}

	return shared.Response(c, fiber.Map{
		"message":       "Cache амжилттай цэвэрлэгдлээ",
		"prefixes":      req.Prefixes,
		"deleted_count": result.DeletedCount,
		"failed_count":  result.FailedCount,
		"duration_ms":   result.Duration.Milliseconds(),
		"errors_count":  len(result.Errors),
	})
}

// HealthCheck нь cache service-ийн health check
func (h *CacheHandler) HealthCheck(c *fiber.Ctx) error {
	err := h.service.HealthCheck()
	if err != nil {
		return shared.ResponseErr(c, "Cache service эрүүл бус байна")
	}

	return shared.Response(c, fiber.Map{
		"status":  "healthy",
		"message": "Cache service хэвийн ажиллаж байна",
	})
}
