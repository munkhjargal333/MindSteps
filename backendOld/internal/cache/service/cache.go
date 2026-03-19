// internal/cache/service/cache_service.go
package service

import (
	"context"
	"fmt"
	"log"
	"time"

	"mindsteps/pkg/redis"

	goredis "github.com/redis/go-redis/v9"
)

// CacheService нь cache удирдлагын үндсэн service
type CacheService struct {
	logger *log.Logger
}

// InvalidateResult нь cache цэвэрлэлтийн үр дүн
type InvalidateResult struct {
	DeletedCount int
	FailedCount  int
	Errors       []error
	Duration     time.Duration
}

// CacheStats нь cache статистик
type CacheStats struct {
	TotalKeys   int                      `json:"total_keys"`
	PrefixCount map[string]int           `json:"prefix_count"`
	PrefixTTL   map[string]time.Duration `json:"prefix_ttl,omitempty"`
	MemoryUsage string                   `json:"memory_usage,omitempty"`
	Timestamp   time.Time                `json:"timestamp"`
}

// NewCacheService нь шинэ CacheService үүсгэнэ
func NewCacheService(logger *log.Logger) *CacheService {
	if logger == nil {
		logger = log.Default()
	}
	return &CacheService{
		logger: logger,
	}
}

// InvalidateAll нь бүх cache цэвэрлэх
func (s *CacheService) InvalidateAll() (*InvalidateResult, error) {
	return s.invalidateByPattern("cache:*")
}

// InvalidateByPrefix нь prefix-ээр cache цэвэрлэх
func (s *CacheService) InvalidateByPrefix(prefix string) (*InvalidateResult, error) {
	pattern := fmt.Sprintf("cache:%s:*", prefix)
	return s.invalidateByPattern(pattern)
}

// InvalidateByPrefixes нь олон prefix-ээр cache цэвэрлэх
func (s *CacheService) InvalidateByPrefixes(prefixes []string) (*InvalidateResult, error) {
	totalResult := &InvalidateResult{
		Errors: []error{},
	}
	startTime := time.Now()

	for _, prefix := range prefixes {
		result, err := s.InvalidateByPrefix(prefix)
		if err != nil {
			totalResult.Errors = append(totalResult.Errors, err)
			continue
		}
		totalResult.DeletedCount += result.DeletedCount
		totalResult.FailedCount += result.FailedCount
		totalResult.Errors = append(totalResult.Errors, result.Errors...)
	}

	totalResult.Duration = time.Since(startTime)
	return totalResult, nil
}

// invalidateByPattern нь pattern-ээр cache цэвэрлэх
func (s *CacheService) invalidateByPattern(pattern string) (*InvalidateResult, error) {
	startTime := time.Now()
	result := &InvalidateResult{
		Errors: []error{},
	}

	client := redis.GetRedis()
	if client == nil {
		return nil, fmt.Errorf("redis client байхгүй байна")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var cursor uint64
	const batchSize = 100

	for {
		keys, nextCursor, err := client.Scan(ctx, cursor, pattern, batchSize).Result()
		if err != nil {
			result.Errors = append(result.Errors, fmt.Errorf("scan алдаа: %w", err))
			break
		}

		if len(keys) > 0 {
			// Pipeline ашиглан олон key-г нэгэн зэрэг устгах
			deleted, failed := s.deleteBatch(ctx, client, keys)
			result.DeletedCount += deleted
			result.FailedCount += failed
		}

		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}

	result.Duration = time.Since(startTime)

	s.logger.Printf("Cache invalidation: pattern=%s, deleted=%d, failed=%d, duration=%v",
		pattern, result.DeletedCount, result.FailedCount, result.Duration)

	return result, nil
}

// deleteBatch нь batch-аар key-уудыг устгах
func (s *CacheService) deleteBatch(ctx context.Context, client *goredis.Client, keys []string) (deleted, failed int) {
	pipe := client.Pipeline()

	for _, key := range keys {
		pipe.Del(ctx, key)
	}

	cmds, err := pipe.Exec(ctx)
	if err != nil && err != goredis.Nil {
		s.logger.Printf("Pipeline exec алдаа: %v", err)
		// Алдаа гарсан тохиолдолд нэг бүрчлэн устгах
		return s.deleteOneByOne(ctx, client, keys)
	}

	// Амжилттай устгасан key-ийн тоо
	for _, cmd := range cmds {
		if cmd.Err() == nil {
			deleted++
		} else {
			failed++
			s.logger.Printf("Key устгах алдаа: %v", cmd.Err())
		}
	}

	return deleted, failed
}

// deleteOneByOne нь key-уудыг нэг бүрчлэн устгах (fallback)
func (s *CacheService) deleteOneByOne(ctx context.Context, client *goredis.Client, keys []string) (deleted, failed int) {
	for _, key := range keys {
		if err := client.Del(ctx, key).Err(); err != nil {
			s.logger.Printf("Key '%s' устгах алдаа: %v", key, err)
			failed++
			continue
		}
		deleted++
	}

	return deleted, failed
}

// GetStats нь cache статистик авах
func (s *CacheService) GetStats() (*CacheStats, error) {
	client := redis.GetRedis()
	if client == nil {
		return nil, fmt.Errorf("redis client байхгүй байна")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var cursor uint64
	totalKeys := 0
	prefixCount := make(map[string]int)
	prefixTTL := make(map[string]time.Duration)

	for {
		keys, nextCursor, err := client.Scan(ctx, cursor, "cache:*", 100).Result()
		if err != nil {
			return nil, fmt.Errorf("scan алдаа: %w", err)
		}

		totalKeys += len(keys)

		for _, key := range keys {
			// Prefix тооцох
			if len(key) > 6 {
				prefix := s.extractPrefix(key)
				prefixCount[prefix]++

				// TTL авах (анхны key-д л)
				if prefixCount[prefix] == 1 {
					ttl, err := client.TTL(ctx, key).Result()
					if err == nil && ttl > 0 {
						prefixTTL[prefix] = ttl
					}
				}
			}
		}

		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}

	// Memory usage авах
	memoryUsage := ""
	if info, err := client.Info(ctx, "memory").Result(); err == nil {
		memoryUsage = s.parseMemoryUsage(info)
	}

	stats := &CacheStats{
		TotalKeys:   totalKeys,
		PrefixCount: prefixCount,
		PrefixTTL:   prefixTTL,
		MemoryUsage: memoryUsage,
		Timestamp:   time.Now(),
	}

	return stats, nil
}

// extractPrefix нь cache key-аас prefix-ийг задлан авах
func (s *CacheService) extractPrefix(key string) string {
	if len(key) <= 6 {
		return ""
	}

	parts := key[6:] // "cache:" хэсгийг авч хая
	for i, ch := range parts {
		if ch == ':' {
			return parts[:i]
		}
	}

	// ":" олдохгүй бол бүх үлдсэн хэсгийг буцаах
	return parts
}

// parseMemoryUsage нь Redis INFO-аас memory ашиглалтыг задлах
func (s *CacheService) parseMemoryUsage(info string) string {
	// Жишээ: "used_memory_human:2.50M" гэх мэт мөрөөс утга авах
	lines := []byte(info)
	target := []byte("used_memory_human:")

	start := 0
	for i := 0; i < len(lines); i++ {
		if i+len(target) <= len(lines) && string(lines[i:i+len(target)]) == string(target) {
			start = i + len(target)
			end := start
			for end < len(lines) && lines[end] != '\r' && lines[end] != '\n' {
				end++
			}
			return string(lines[start:end])
		}
	}

	return "N/A"
}

// WarmCache нь cache-ийг урьдчилан бөглөх (optional)
func (s *CacheService) WarmCache(warmupFunc func() error) error {
	s.logger.Println("Cache warming эхэллээ...")
	startTime := time.Now()

	if err := warmupFunc(); err != nil {
		s.logger.Printf("Cache warming алдаа: %v", err)
		return err
	}

	s.logger.Printf("Cache warming дууслаа. Хугацаа: %v", time.Since(startTime))
	return nil
}

// HealthCheck нь cache сервисийн эрүүл мэндийг шалгах
func (s *CacheService) HealthCheck() error {
	client := redis.GetRedis()
	if client == nil {
		return fmt.Errorf("redis client байхгүй байна")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return fmt.Errorf("redis холболт алдаатай: %w", err)
	}

	return nil
}
