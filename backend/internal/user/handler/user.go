package handler

import (
	"mindsteps/internal/shared"
	"mindsteps/internal/user/services"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	service *services.UserService
}

func NewUserHandler(service *services.UserService) *UserHandler {
	return &UserHandler{
		service: service,
	}
}

func (h *UserHandler) ListAll(c *fiber.Ctx) error {
	users, err := h.service.ListAll()
	if err != nil {
		return shared.ResponseErr(c, err.Error())
	}

	if len(users) == 0 {
		return shared.ResponseNotFound(c)
	}

	return shared.Response(c, users)
}

func (h *UserHandler) Delete(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return shared.ResponseBadRequest(c, "invalid id")
	}

	if err := h.service.Delete(uint(id)); err != nil {
		return shared.ResponseErr(c, err.Error())
	}

	return shared.Response(c, "Амжилттай устгалаа")
}
