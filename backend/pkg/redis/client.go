// pkg/redis/client.go
package redis

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/gofiber/storage/redis/v3"
	goredis "github.com/redis/go-redis/v9"
)

var (
	redisClient  *goredis.Client
	fiberStorage *redis.Storage
	once         sync.Once
)

const (
	maxRetries = 3               // Нийт оролдох тоо
	retryDelay = 5 * time.Second // Дараагийн оролдолт хүртэлх хугацаа
)

func InitRedis(ctx context.Context) (*goredis.Client, error) {
	var initErr error
	once.Do(func() {
		redisURL := os.Getenv("REDIS_URL")
		if redisURL == "" {
			initErr = fmt.Errorf("REDIS_URL тохируулаагүй байна")
			return
		}

		opt, parseErr := goredis.ParseURL(redisURL)
		if parseErr != nil {
			initErr = fmt.Errorf("Redis URL parse хийхэд алдаа: %w", parseErr)
			return
		}

		if opt.TLSConfig == nil && opt.Addr != "" {
			opt.TLSConfig = &tls.Config{InsecureSkipVerify: true}
		}

		// Client үүсгэх
		client := goredis.NewClient(opt)

		// --- RETRY LOGIC ЭНД ЭХЭЛЖ БАЙНА ---
		for i := 1; i <= maxRetries; i++ {
			log.Printf("Redis холболт шалгаж байна... (Оролдолт %d/%d)", i, maxRetries)

			// Ping хийхдээ богино хугацааны Timeout өгөх
			pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
			defer cancel()

			if err := client.Ping(pingCtx).Err(); err == nil {
				redisClient = client
				log.Println("✅ Redis амжилттай холбогдлоо")

				// Fiber Storage үүсгэх
				fiberStorage = redis.New(redis.Config{
					URL:   redisURL,
					Reset: false,
				})
				return // Амжилттай бол функцээс гарна
			}

			if i < maxRetries {
				time.Sleep(retryDelay) // Дараагийн оролдолт хүртэл хүлээх
			} else {
				initErr = fmt.Errorf("Redis холболт %d оролдолтын дараа амжилтгүй боллоо", maxRetries)
			}
		}
	})

	return redisClient, initErr
}

// GetRedis нь Redis client буцаана
func GetRedis() *goredis.Client {
	return redisClient
}

// GetFiberStorage нь Fiber storage буцаана
func GetFiberStorage() *redis.Storage {
	return fiberStorage
}

// CloseRedis нь Redis холболтыг хааж байна
func CloseRedis() error {
	if redisClient != nil {
		return redisClient.Close()
	}
	return nil
}
