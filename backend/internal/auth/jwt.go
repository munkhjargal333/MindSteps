package auth

import (
	"crypto/rsa"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type GJWT struct {
	Private *rsa.PrivateKey
	Public  *rsa.PublicKey
}

type TokenGenerator interface {
	GenerateToken(claims *Token, expiresMinut time.Duration) (string, error)
	ReadToken(token string) (*Token, error)
}

var Gjwt TokenGenerator

func (g *GJWT) GenerateToken(claims *Token, expiresMinut time.Duration) (string, error) {
	claims.RegisteredClaims = jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * expiresMinut)),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	return token.SignedString(g.Private)
}

func (g *GJWT) ReadToken(inToken string) (*Token, error) {
	if g == nil {
		return nil, fmt.Errorf("does not have jwt")
	}
	var t Token
	if _, err := jwt.ParseWithClaims(inToken, &t, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return g.Public, nil
	}); err != nil {
		return nil, err
	}
	return &t, nil
}

type ResToken struct {
	Token string `json:"token"`
}
