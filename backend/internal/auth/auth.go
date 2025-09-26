package auth

import (
	"mindsteps/config"
	"mindsteps/database"

	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt/v4"
	"gorm.io/datatypes"
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

type SystemRole struct {
	Code        string         `json:"code"`
	Permissions datatypes.JSON `json:"permissions"`
}

var SystemRoles = map[string]SystemRole{}

func InitRole(systemCode string) {
	db := database.DB
	config := config.Get()

	clientId := 0
	if err := db.Raw("select id FROM " + config.DB.Schema + ".bs_clients" + " where code = '" + systemCode + "' AND is_active=true").Scan(&clientId).Error; err != nil {
		return
	}
	list := make([]SystemRole, 0)

	if err := db.Raw("select code, permissions FROM " + config.DB.Schema + ".bs_roles" + " where client_id = '" + string(clientId) + "' AND is_active=true").Scan(&list).Error; err != nil {
		return
	}

	for _, role := range list {
		SystemRoles[role.Code] = role
	}
}
