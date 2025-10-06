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

// Routes
func (h *JournalHandler) RegisterRoutes(app *fiber.App) {
	app.Post("/journals", auth.TokenMiddleware, h.Create)
	app.Get("/journals", auth.TokenMiddleware, h.ListAll)
	app.Get("/journals/:id", auth.TokenMiddleware, h.GetByID)
	app.Put("/journals/:id", auth.TokenMiddleware, h.Update)
	app.Delete("/journals/:id", auth.TokenMiddleware, h.Delete)
	app.Get("/users/:user_id/journals", auth.TokenMiddleware, h.ListByUserID)
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
	// User өөрийн ID-г зөвшөөрнө
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

// List all journals (admin / for now show all)
func (h *JournalHandler) ListAll(c *fiber.Ctx) error {
	journals, err := h.service.ListAll()
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.JSON(journals)
}

// List journals by user
func (h *JournalHandler) ListByUserID(c *fiber.Ctx) error {
	userID, err := strconv.Atoi(c.Params("user_id"))
	if err != nil {
		return shared.ResponseBadRequest(c, "Invalid user ID")
	}

	tokenInfo := auth.GetTokenInfo(c)
	// Хэрэглэгч зөвхөн өөрийн journals-г харна
	if uint(userID) != tokenInfo.UserID {
		return shared.ResponseForbidden(c)
	}

	journals, err := h.service.ListByUserID(uint(userID))
	if err != nil {
		return shared.ResponseBadRequest(c, err.Error())
	}
	return c.JSON(journals)
}
