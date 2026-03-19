package auth

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// Token - Supabase JWT-н claims
type Token struct {
	jwt.RegisteredClaims
	Email        string `json:"email"`
	Role         string `json:"role"`
	UserID       string `json:"sub"`
	UserMetadata struct {
		FullName  string `json:"full_name"`
		AvatarUrl string `json:"avatar_url"`
	} `json:"user_metadata"`
}

// GetTokenInfo - context-с token мэдээлэл авах
func GetTokenInfo(c *fiber.Ctx) *Token {
	info, ok := c.Locals("tokenInfo").(*Token)
	if !ok {
		return nil
	}
	return info
}

// GetUserID - context-с user ID авах
func GetUserID(c *fiber.Ctx) string {
	userID, ok := c.Locals("userId").(string)
	if !ok {
		return ""
	}
	return userID
}

// TokenMiddleware - JWT token шалгах middleware
func TokenMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return c.Status(401).JSON(fiber.Map{
			"error": "Unauthorized - token байхгүй байна",
		})
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	claims := &Token{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodECDSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return GetSupabasePublicKey(), nil
	})

	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid token - " + err.Error(),
		})
	}

	if !token.Valid {
		return c.Status(401).JSON(fiber.Map{
			"error": "Token хүчингүй байна",
		})
	}

	// Expiration шалгах
	if claims.ExpiresAt != nil && claims.ExpiresAt.Time.Before(time.Now()) {
		return c.Status(401).JSON(fiber.Map{
			"error": "Token-ы хугацаа дууссан байна",
		})
	}

	// Context-д хадгалах
	c.Locals("tokenInfo", claims)
	c.Locals("userId", claims.UserID)

	return c.Next()
}

// RequireRole - тодорхой role шаардах middleware
func RequireRole(requiredRole string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := GetTokenInfo(c)
		if claims == nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "Token мэдээлэл олдсонгүй",
			})
		}

		if claims.Role != requiredRole {
			return c.Status(403).JSON(fiber.Map{
				"error": "Эрх хүрэхгүй байна",
			})
		}

		return c.Next()
	}
}

// RequireAnyRole - олон role-н аль нэгийг шаардах
func RequireAnyRole(roles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := GetTokenInfo(c)
		if claims == nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "Token мэдээлэл олдсонгүй",
			})
		}

		for _, role := range roles {
			if claims.Role == role {
				return c.Next()
			}
		}

		return c.Status(403).JSON(fiber.Map{
			"error": "Эрх хүрэхгүй байна",
		})
	}
}
