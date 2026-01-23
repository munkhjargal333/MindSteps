package auth

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/base64"
	"encoding/json"
	"math/big"
	"os"
	"sync"

	"github.com/gofiber/fiber/v2/log"
)

var (
	supabasePublicKey *ecdsa.PublicKey
	once              sync.Once
)

// MustInitSupabaseJWT инициализ хийнэ - program эхлэхэд нэг удаа дуудна
func MustInitSupabaseJWT() {
	once.Do(func() {
		jwkRaw := os.Getenv("SUPABASE_JWK")
		if jwkRaw == "" {
			log.Fatal("SUPABASE_JWK environment variable not set")
		}

		var jwkData struct {
			X string `json:"x"`
			Y string `json:"y"`
		}

		if err := json.Unmarshal([]byte(jwkRaw), &jwkData); err != nil {
			log.Fatalf("Failed to parse SUPABASE_JWK: %v", err)
		}

		xBytes, err := base64.RawURLEncoding.DecodeString(jwkData.X)
		if err != nil {
			log.Fatalf("Failed to decode X coordinate: %v", err)
		}

		yBytes, err := base64.RawURLEncoding.DecodeString(jwkData.Y)
		if err != nil {
			log.Fatalf("Failed to decode Y coordinate: %v", err)
		}

		supabasePublicKey = &ecdsa.PublicKey{
			Curve: elliptic.P256(),
			X:     new(big.Int).SetBytes(xBytes),
			Y:     new(big.Int).SetBytes(yBytes),
		}

		log.Info("Supabase JWT initialized successfully")
	})
}

// GetSupabasePublicKey - public key-г буцаана
func GetSupabasePublicKey() *ecdsa.PublicKey {
	return supabasePublicKey
}
