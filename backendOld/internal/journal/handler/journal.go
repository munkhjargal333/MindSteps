package handler

import (
	"mindsteps/internal/auth"
	"mindsteps/internal/journal/form"
	"mindsteps/internal/journal/service"
	"mindsteps/internal/shared"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type JournalHandler struct {
	service service.JournalService
}

func NewJournalHandler(s service.JournalService) *JournalHandler {
	return &JournalHandler{service: s}
}

// Create new journal
func (h *JournalHandler) Create(c *fiber.Ctx) error {
	var f form.JournalForm

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

	journal, err := h.service.Create(&f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.Status(fiber.StatusCreated).JSON(journal)
}

// Get journal by id
func (h *JournalHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	journal, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	// Token-д байгаа UserID-тэй тааруулж шалгах
	tokenInfo := auth.GetTokenInfo(c)
	if journal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	return c.JSON(journal)
}

// Update journal
func (h *JournalHandler) Update(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	var f form.JournalForm
	if err := c.BodyParser(&f); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	if err := f.Validate(); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)

	journal, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	if journal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	// Update service call
	journal, err = h.service.Update(uint(id), &f)
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.JSON(journal)
}

// Delete journal
func (h *JournalHandler) Delete(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid ID")
	}

	journal, err := h.service.GetByID(uint(id))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	tokenInfo := auth.GetTokenInfo(c)
	if journal.UserID != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	if err := h.service.Delete(uint(id)); err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}

// List journals by user
func (h *JournalHandler) ListByUserID(c *fiber.Ctx) error {
	tokenInfo := auth.GetTokenInfo(c)

	if tokenInfo == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	journals, total, err := h.service.ListByUserID(tokenInfo.UserID, page, limit)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"page":     page,
		"limit":    limit,
		"total":    total,
		"journals": journals,
	})
}
