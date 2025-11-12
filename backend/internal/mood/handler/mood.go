package handler

import (
	"mindsteps/internal/mood/form"
	"mindsteps/internal/mood/service"
	"mindsteps/internal/shared"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type MoodHandler struct {
	service service.MoodService
}

func NewMoodHandler(s service.MoodService) *MoodHandler {
	return &MoodHandler{service: s}
}

// Create new mood
func (h *MoodHandler) Create(c *fiber.Ctx) error {
	var f form.MoodForm

	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	mood, err := h.service.Create(&f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(mood)
}

// Get mood by ID
func (h *MoodHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	mood, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(mood)
}

// Update mood
func (h *MoodHandler) Update(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	var f form.MoodForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	mood, err := h.service.Update(uint(id), &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(mood)
}

// Delete mood
func (h *MoodHandler) Delete(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	if err := h.service.Delete(uint(id)); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}

// List moods with pagination
func (h *MoodHandler) List(c *fiber.Ctx) error {
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	moods, total, err := h.service.List(page, limit)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"page":  page,
		"limit": limit,
		"total": total,
		"moods": moods,
	})
}

// List moods by category ID
func (h *MoodHandler) ListByCategoryID(c *fiber.Ctx) error {
	categoryID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	moods, err := h.service.ListByCategoryID(categoryID)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(moods)
}
