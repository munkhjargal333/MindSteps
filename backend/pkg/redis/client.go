// ============================================
// pkg/cache/redis.go - Redis Connection
// ============================================
package cache

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/redis/go-redis/v9"
)

var (
	redisClient *redis.Client
	once        sync.Once
	ctx         = context.Background()
)

// InitRedis инициализаци хийнэ
func InitRedis(ctx context.Context) (*redis.Client, error) {
	var initErr error

	once.Do(func() {
		redisURL := os.Getenv("REDIS_URL")
		if redisURL == "" {
			initErr = fmt.Errorf("REDIS_URL тохируулаагүй байна")
			return
		}

		opt, parseErr := redis.ParseURL(redisURL)
		if parseErr != nil {
			initErr = fmt.Errorf("Redis URL parse хийхэд алдаа: %w", parseErr)
			return
		}

		// Cloud Redis (Render, Upstash гэх мэт) TLS шаарддаг бол
		if opt.TLSConfig == nil && opt.Addr != "" {
			opt.TLSConfig = &tls.Config{
				InsecureSkipVerify: true, // туршилтад; production-д бол сертификатыг зөв тохируул
			}
		}

		redisClient = redis.NewClient(opt)

		// Холболт шалгах
		if pingErr := redisClient.Ping(ctx).Err(); pingErr != nil {
			initErr = fmt.Errorf("Redis холболт амжилтгүй: %w", pingErr)
			return
		}

		log.Println("✅ Redis холбогдлоо:", opt.Addr)
	})

	return redisClient, initErr
}

// GetRedis клиент буцаана
func GetRedis() *redis.Client {
	return redisClient
}

// CloseRedis холболт хаана
func CloseRedis() error {
	if redisClient != nil {
		return redisClient.Close()
	}
	return nil
}

// ============================================
// internal/lesson/service/lesson.go - Updated Service with Cache
// ============================================

// GetAllCategory кэш ашиглан category жагсаалт авах
// func (s *lessonService) GetAllCategory() ([]model.LessonCategory, error) {
// 	cacheKey := "lesson:categories"

// 	// 1. Cache-аас уншиж үзнэ
// 	if redisClient := cache.GetRedis(); redisClient != nil {
// 		cached, err := redisClient.Get(ctx, cacheKey).Result()
// 		if err == nil && cached != "" {
// 			var categories []model.LessonCategory
// 			if unmarshalErr := json.Unmarshal([]byte(cached), &categories); unmarshalErr == nil {
// 				log.Println("✅ Lesson categories cache-аас авлаа")
// 				return categories, nil
// 			}
// 		}
// 	}

// 	// 2. Cache-д байхгүй бол database-аас татна
// 	categories, err := s.repo.CategoriesList()
// 	if err != nil {
// 		return nil, err
// 	}

// 	// 3. Cache-д хадгална (30 минут)
// 	if redisClient := cache.GetRedis(); redisClient != nil {
// 		data, _ := json.Marshal(categories)
// 		redisClient.Set(ctx, cacheKey, data, 30*time.Minute)
// 		log.Println("✅ Lesson categories cache-д хадгалагдлаа")
// 	}

// 	return categories, nil
// }

// // InvalidateLessonCategoriesCache - Category өөрчлөгдөх үед кэш устгана
// func InvalidateLessonCategoriesCache() {
// 	if redisClient := cache.GetRedis(); redisClient != nil {
// 		redisClient.Del(ctx, "lesson:categories")
// 		log.Println("🗑️ Lesson categories cache устгагдлаа")
// 	}
// }

// // ============================================
// // internal/mood/service/mood_entries.go - Updated Service with Cache
// // ============================================

// // ListByMoodID кэш ашиглан mood categories жагсаалт авах
// func (s *moodEntryService) ListByMoodID() ([]model.MoodCategories, error) {
// 	cacheKey := "mood:categories"

// 	// 1. Cache-аас уншиж үзнэ
// 	if redisClient := cache.GetRedis(); redisClient != nil {
// 		cached, err := redisClient.Get(ctx, cacheKey).Result()
// 		if err == nil && cached != "" {
// 			var categories []model.MoodCategories
// 			if unmarshalErr := json.Unmarshal([]byte(cached), &categories); unmarshalErr == nil {
// 				log.Println("✅ Mood categories cache-аас авлаа")
// 				return categories, nil
// 			}
// 		}
// 	}

// 	// 2. Cache-д байхгүй бол database-аас татна
// 	categories, err := s.repo.ListByMoodID()
// 	if err != nil {
// 		return nil, err
// 	}

// 	// 3. Cache-д хадгална (1 цаг)
// 	if redisClient := cache.GetRedis(); redisClient != nil {
// 		data, _ := json.Marshal(categories)
// 		redisClient.Set(ctx, cacheKey, data, 1*time.Hour)
// 		log.Println("✅ Mood categories cache-д хадгалагдлаа")
// 	}

// 	return categories, nil
// }

// // InvalidateMoodCategoriesCache - Mood category өөрчлөгдөх үед кэш устгана
// func InvalidateMoodCategoriesCache() {
// 	if redisClient := cache.GetRedis(); redisClient != nil {
// 		redisClient.Del(ctx, "mood:categories")
// 		log.Println("🗑️ Mood categories cache устгагдлаа")
// 	}
// }
