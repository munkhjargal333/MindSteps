package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth"
	userHandler "mindsteps/internal/user/handler"
	userRepo "mindsteps/internal/user/repository"
	userService "mindsteps/internal/user/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterUserRoutes(api fiber.Router) {
	userRepository := userRepo.NewUserRepository(database.DB)
	userSvc := userService.NewUserService(userRepository)
	h := userHandler.NewUserHandler(userSvc)

	user := api.Group("/users", auth.TokenMiddleware)

	user.Get("/me", h.GetProfile)
	user.Put("/me", h.UpdateProfile)
	user.Post("/change-password", h.ChangePassword)
	user.Delete("/me", h.DeleteAccount)
}
