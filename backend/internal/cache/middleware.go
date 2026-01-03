// router/cache_middleware.go
package cache

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"mindsteps/pkg/redis"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cache"
)

// CacheConfig нь cache тохиргооны бүтэц
type CacheConfig struct {
	Expiration time.Duration
	Methods    []string
	StatusCode []int
	KeyPrefix  string
}

// NewCacheMiddleware нь Fiber cache middleware буцаана
func NewCacheMiddleware(config CacheConfig) fiber.Handler {
	storage := redis.GetFiberStorage()
	if storage == nil {
		// Redis холбогдоогүй бол cache-гүй үргэлжлүүлнэ
		return func(c *fiber.Ctx) error {
			return c.Next()
		}
	}

	// Default утгууд
	if config.Expiration == 0 {
		config.Expiration = 5 * time.Minute
	}
	if len(config.Methods) == 0 {
		config.Methods = []string{fiber.MethodGet}
	}
	if len(config.StatusCode) == 0 {
		config.StatusCode = []int{fiber.StatusOK}
	}

	return cache.New(cache.Config{
		Storage:    storage,
		Expiration: config.Expiration,
		Methods:    config.Methods,

		KeyGenerator: func(c *fiber.Ctx) string {
			method := c.Method()
			path := c.Path()
			query := c.Request().URI().QueryString()

			// POST, PUT, PATCH request-ийн body-г cache key-д оруулах
			body := []byte{}
			if method == fiber.MethodPost || method == fiber.MethodPut || method == fiber.MethodPatch {
				body = c.Body()
			}

			// SHA-256 hash үүсгэх
			hash := sha256.New()
			hash.Write([]byte(method))
			hash.Write([]byte(path))
			hash.Write(query)
			hash.Write(body)

			hashStr := hex.EncodeToString(hash.Sum(nil))

			// Prefix-тэй эсвэл prefix-гүй cache key
			if config.KeyPrefix != "" {
				return fmt.Sprintf("cache:%s:%s", config.KeyPrefix, hashStr)
			}
			return fmt.Sprintf("cache:%s", hashStr)
		},

		CacheControl:         true,
		StoreResponseHeaders: true,
	})
}
