package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth/handler"
	"mindsteps/internal/auth/services"
	"mindsteps/internal/user/repository"

	"github.com/gofiber/fiber/v2"
)

func RegisterAuthRoutes(api fiber.Router) {

	userRepo := repository.NewUserRepository(database.DB)
	authService := services.NewAuthService(userRepo)
	h := handler.NewAuthHandler(authService)

	// Public routes
	auth := api.Group("/auth")
	auth.Post("/register", h.Register)
	auth.Post("/login", h.Login)
	// 	auth.Post("/refresh", h.RefreshToken)
	// 	auth.Post("/forgot-password", h.ForgotPassword)
	// 	auth.Post("/reset-password", h.ResetPassword)

	// protected := api.Group("/auth")
	// protected.Use(middleware.JWTMiddleware()) // JWT middleware
	// protected.Post("/logout", h.Logout)
	// protected.Get("/me", h.GetCurrentUser)
	// protected.Put("/change-password", h.ChangePassword)
}
