package handler

import (
	"mindsteps/internal/auth/services"
	"mindsteps/internal/shared"
	"mindsteps/internal/user/form"

	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	service *services.AuthService
}

func NewAuthHandler(service *services.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

// POST /register
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var f form.RegisterForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	user, err := h.service.Register(&f)
	if err != nil {
		return shared.ResponseErr(c, err.Error())
	}
	return shared.Response(c, user)
}

// POST /login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var f form.LoginForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	user, err := h.service.Login(&f)
	if err != nil {
		return shared.ResponseUnauthorized(c)
	}

	// TODO: JWT generate
	return shared.Response(c, user)
}
