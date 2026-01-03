package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth"
	"mindsteps/internal/gamification/handler"
	"mindsteps/internal/gamification/repository"
	"mindsteps/internal/gamification/service"

	"github.com/gofiber/fiber/v2"
)

func RegistergamificationRoutes(api fiber.Router) {
	repo := repository.NewGamificationRepository(database.DB)
	svc := service.NewGamificationService(repo)
	handler := handler.NewGamificationHandler(svc)

	gamification := api.Group("/gamification", auth.TokenMiddleware)

	gamification.Get("/me", handler.GetUserGamification)
}
