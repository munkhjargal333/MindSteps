package router

import (
	"mindsteps/database"
	"mindsteps/internal/user/handler"
	"mindsteps/internal/user/repository"
	"mindsteps/internal/user/services"

	"github.com/gofiber/fiber/v2"
)

func RegisterUserRoutes(api fiber.Router) {
	userRepo := repository.NewUserRepository(database.DB)
	userService := services.NewUserService(userRepo)
	h := handler.NewUserHandler(userService)

	// Public routes
	user := api.Group("/user")
	//user.Get("/me")
	user.Get("/list", h.ListAll)
	user.Delete("/delete/:id", h.Delete)
}
