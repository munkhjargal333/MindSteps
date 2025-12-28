package handler

import (
	"mindsteps/internal/mood/service"
	"mindsteps/internal/shared"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type MoodUnitHandler struct {
	service service.MoodUnitService
}

func NewMoodUnitHandler(s service.MoodUnitService) *MoodUnitHandler {
	return &MoodUnitHandler{service: s}
}

// Get mood unit by ID
func (h *MoodUnitHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	moodUnit, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(moodUnit)
}

// List mood units with pagination
func (h *MoodUnitHandler) List(c *fiber.Ctx) error {
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	moodUnits, total, err := h.service.List(page, limit)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"page":       page,
		"limit":      limit,
		"total":      total,
		"mood_units": moodUnits,
	})
}

// List mood units by category ID
func (h *MoodUnitHandler) ListByCategoryID(c *fiber.Ctx) error {
	categoryID, err := strconv.ParseUint(c.Params("categoryId"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid category ID")
	}

	moodUnits, err := h.service.ListByCategoryID(uint(categoryID))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(moodUnits)
}

// List mood units by type
func (h *MoodUnitHandler) ListByType(c *fiber.Ctx) error {
	moodType := c.Params("type")

	moodUnits, err := h.service.ListByType(moodType)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(moodUnits)
}
