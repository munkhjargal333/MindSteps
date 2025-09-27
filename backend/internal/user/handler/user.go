package handler

import (
	"mindsteps/internal/shared"
	"mindsteps/internal/user/form"
	"mindsteps/internal/user/services"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	service *services.UserService
}

func NewUserHandler() *UserHandler {
	return &UserHandler{
		service: services.NewUserService(),
	}
}

func (h *UserHandler) Register(c *fiber.Ctx) error {
	var form form.RegisterForm
	if err := c.BodyParser(&form); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if err := form.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	user, err := h.service.Register(&form)
	if err != nil {
		return shared.ResponseErr(c, err.Error())
	}

	return shared.Response(c, user)
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
