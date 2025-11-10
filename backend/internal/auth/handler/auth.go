package handler

import (
	"mindsteps/internal/auth/form"
	"mindsteps/internal/auth/service"
	"mindsteps/internal/shared"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	service service.AuthService
}

func NewAuthHandler(s service.AuthService) *AuthHandler {
	return &AuthHandler{service: s}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var f form.RegisterForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	token, user, err := h.service.Register(&f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Амжилттай бүртгэгдлээ",
		"token":   token,
		"user": fiber.Map{
			"id":    user.ID,
			"uuid":  user.UUID,
			"name":  user.Name,
			"email": user.Email,
		},
	})
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var f form.LoginForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	token, user, err := h.service.Login(&f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Амжилттай нэвтэрлээ",
		"token":   token,
		"user": fiber.Map{
			"id":                user.ID,
			"uuid":              user.UUID,
			"name":              user.Name,
			"email":             user.Email,
			"total_score":       user.TotalScore,
			"current_level":     user.CurrentLevel,
			"is_email_verified": user.IsEmailVerified,
		},
	})
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return shared.ResponseUnauthorized(c)
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	if err := h.service.Logout(token); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Амжилттай гарлаа",
	})
}

func (h *AuthHandler) ForgotPassword(c *fiber.Ctx) error {
	var f form.ForgotPasswordForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if err := h.service.ForgotPassword(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "OTP код таны email хаяг руу илгээгдлээ",
	})
}

func (h *AuthHandler) ResetPassword(c *fiber.Ctx) error {
	var f form.ResetPasswordForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if err := h.service.ResetPassword(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Нууц үг амжилттай солигдлоо",
	})
}

func (h *AuthHandler) VerifyOTP(c *fiber.Ctx) error {
	var f form.VerifyOTPForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if err := h.service.VerifyOTP(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Email амжилттай баталгаажлаа",
	})
}
