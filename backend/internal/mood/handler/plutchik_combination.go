package handler

import (
	"mindsteps/internal/mood/form"
	"mindsteps/internal/mood/service"
	"mindsteps/internal/shared"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type PlutchikCombinationHandler struct {
	service service.PlutchikCombinationService
}

func NewPlutchikCombinationHandler(s service.PlutchikCombinationService) *PlutchikCombinationHandler {
	return &PlutchikCombinationHandler{service: s}
}

func (h *PlutchikCombinationHandler) EmotionList(c *fiber.Ctx) error {
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	combinations, err := h.service.EmotionList(page, limit)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.JSON(combinations)
}

// List all combinations
func (h *PlutchikCombinationHandler) List(c *fiber.Ctx) error {
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	combinations, err := h.service.List(page, limit)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.JSON(combinations)
}

// Get combination by ID
func (h *PlutchikCombinationHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	combination, err := h.service.GetByID(id)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(combination)
}

// Update combination (Admin only)
func (h *PlutchikCombinationHandler) Update(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	var f form.PlutchikCombinationForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	combination, err := h.service.Update(id, &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(combination)
}

// Delete combination (Admin only)
func (h *PlutchikCombinationHandler) Delete(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	if err := h.service.Delete(id); err != nil {
		return shared.ResponseBadRequest(c, "Cannot delete combination that is in use")
	}

	return c.SendStatus(fiber.StatusNoContent)
}
