package handler

import (
	"mindsteps/internal/auth"
	"mindsteps/internal/core_value/form"
	"mindsteps/internal/core_value/service"
	"mindsteps/internal/shared"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type CoreValueHandler struct {
	service service.CoreValueService
}

func NewCoreValueHandler(s service.CoreValueService) *CoreValueHandler {
	return &CoreValueHandler{service: s}
}

func (h *CoreValueHandler) Create(c *fiber.Ctx) error {
	var f form.CoreValueForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	f.UserID = tokenInfo.UserID

	value, err := h.service.Create(&f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.Status(fiber.StatusCreated).JSON(value)
}

func (h *CoreValueHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	value, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if value.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	return c.JSON(value)
}

func (h *CoreValueHandler) Update(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	var f form.CoreValueForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	// if err := f.Validate(); err != nil {
	// 	return shared.ResponseBadRequest(c, err.Error())
	// }

	tokenInfo := auth.GetTokenInfo(c)
	value, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if value.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	value, err = h.service.Update(uint(id), &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.JSON(value)
}

func (h *CoreValueHandler) Delete(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	value, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if value.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	if err := h.service.Delete(uint(id)); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (h *CoreValueHandler) ListByUserID(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	values, err := h.service.ListByUserID(tokenInfo.UserID)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"core_values": values,
		"total":       len(values),
	})
}

func (r *CoreValueHandler) MaslowLevelList(c *fiber.Ctx) error {
	levels, err := r.service.MaslowLevelList()
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.JSON(levels)
}
