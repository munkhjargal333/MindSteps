package routers

import (
	"mindsteps/internal/router"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {

	api := app.Group("/api/v1")

	router.RegisterAuthRoutes(api)
	router.RegisterUserRoutes(api)
	router.RegisterjournalRoutes(api)
}
