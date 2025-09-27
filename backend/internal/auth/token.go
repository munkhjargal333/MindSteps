package auth

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

type Token struct {
	jwt.RegisteredClaims
	SystemCode string   `json:"system_code"`
	OrgID      uint     `json:"org_id"`
	UserID     uint     `json:"user_id"`
	UserEmail  string   `json:"user_email"`
	Roles      []string `json:"roles"`
	Level      int      `json:"level"`
	Otp        bool     `json:otp`
}

func GetTokenInfo(c *fiber.Ctx) *Token {
	cs := c.Locals("tokenInfo")
	info, ok := cs.(*Token)
	if !ok {
		return nil
	}
	return info
}

func CreateUserSession(tokenInfo *Token) (string, error) {
	token, err := Gjwt.GenerateToken(tokenInfo, time.Duration(144000*3))
	if err != nil {
		return "", err
	}

	return token, nil
}

func CreateSystemSession(systemCode string, roles []string, day uint) (string, error) {
	tokenInfo := &Token{
		SystemCode: systemCode,
		Roles:      roles,
	}

	token, err := Gjwt.GenerateToken(tokenInfo, time.Duration(day*24*1440))
	if err != nil {
		return "", err
	}

	return token, nil
}
