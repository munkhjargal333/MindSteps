package auth

import (
	"mindsteps/config"

	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt/v4"
)

func MustInitGjwt() {
	config := config.Get().Auth

	var (
		result GJWT
	)

	private, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(config.JwtPrivateKey))
	if err != nil {
		log.Fatal("error parsing private key", err)
		return
	}
	result.Private = private

	public, err := jwt.ParseRSAPublicKeyFromPEM([]byte(config.JwtPublicKey))
	if err != nil {
		log.Fatal("error parsing public key", err)
		return
	}
	result.Public = public

	Gjwt = &result
}
