package router

import (
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {

	api := app.Group("/api/v1")

	RegisterAuthRoutes(api)
	RegisterUserRoutes(api)
	RegisterjournalRoutes(api)
}
