package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth"
	authHandler "mindsteps/internal/auth/handler"
	authRepo "mindsteps/internal/auth/repository"
	authService "mindsteps/internal/auth/service"
	userRepo "mindsteps/internal/user/repository"

	"github.com/gofiber/fiber/v2"
)

func RegisterAuthRoutes(api fiber.Router) {
	userRepository := userRepo.NewUserRepository(database.DB)
	authRepository := authRepo.NewAuthRepository(database.DB)
	authSvc := authService.NewAuthService(userRepository, authRepository)
	h := authHandler.NewAuthHandler(authSvc)

	authGroup := api.Group("/auth")

	// Public routes
	authGroup.Post("/register", h.Register)
	authGroup.Post("/login", h.Login)
	authGroup.Post("/forgot-password", h.ForgotPassword)
	authGroup.Post("/reset-password", h.ResetPassword)
	authGroup.Post("/verify-otp", h.VerifyOTP)

	// Protected routes
	authGroup.Post("/logout", auth.TokenMiddleware, h.Logout)
}
