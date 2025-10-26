package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth"
	"mindsteps/internal/journal/handler"
	"mindsteps/internal/journal/repository"
	"mindsteps/internal/journal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterjournalRoutes(api fiber.Router) {

	journalRepo := repository.NewJournalRepository(database.DB)
	journalService := service.NewJournalService(journalRepo)
	h := handler.NewJournalHandler(journalService)

	journal := api.Group("/journals", auth.TokenMiddleware)

	journal.Post("/", h.Create)
	journal.Get("/", h.ListAll)
	journal.Get("/:id", h.GetByID)
	journal.Put("/:id", h.Update)
	journal.Delete("/:id", h.Delete)

	journal.Get("/me", h.ListByUserID)

}
