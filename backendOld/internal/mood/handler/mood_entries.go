package handler

import (
	"mindsteps/internal/auth"
	"mindsteps/internal/mood/form"
	"mindsteps/internal/mood/service"
	"mindsteps/internal/shared"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type MoodEntryHandler struct {
	service service.MoodEntryService
}

func NewMoodEntryHandler(s service.MoodEntryService) *MoodEntryHandler {
	return &MoodEntryHandler{service: s}
}

func (h *MoodEntryHandler) Create(c *fiber.Ctx) error {
	var f form.MoodEntryForm

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

	entry, err := h.service.Create(&f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.Status(fiber.StatusCreated).JSON(entry)
}

func (h *MoodEntryHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	entry, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if entry.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	return c.JSON(entry)
}

func (h *MoodEntryHandler) Update(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	var f form.MoodEntryForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	// if err := f.Validate(); err != nil {
	// 	return shared.ResponseBadRequest(c, err.Error())
	// }

	tokenInfo := auth.GetTokenInfo(c)
	entry, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if entry.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	entry, err = h.service.Update(uint(id), &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.JSON(entry)
}

func (h *MoodEntryHandler) Delete(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	entry, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if entry.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	if err := h.service.Delete(uint(id)); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (h *MoodEntryHandler) ListByUserID(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	entries, total, err := h.service.ListByUserID(tokenInfo.UserID, page, limit)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"page":    page,
		"limit":   limit,
		"total":   total,
		"entries": entries,
	})
}

func (h *MoodEntryHandler) GetStatistics(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)
	if tokenInfo == nil {
		return shared.ResponseUnauthorized(c)
	}

	days := c.QueryInt("days", 30)

	stats, err := h.service.GetStatistics(tokenInfo.UserID, days)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.JSON(stats)
}

func (h *MoodEntryHandler) MoodCategories(c *fiber.Ctx) error {
	moodId, err := h.service.ListByMoodID()

	if err != nil {
		return shared.ResponseNotFound(c)
	}
	return c.JSON(moodId)
}
