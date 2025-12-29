package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth"
	gamificationRepo "mindsteps/internal/gamification/repository"
	gamificationService "mindsteps/internal/gamification/service"
	"mindsteps/internal/journal/handler"
	"mindsteps/internal/journal/repository"
	"mindsteps/internal/journal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterjournalRoutes(api fiber.Router) {

	gamificationRepo := gamificationRepo.NewGamificationRepository(database.DB)
	gamificationService := gamificationService.NewGamificationService(gamificationRepo)

	journalRepo := repository.NewJournalRepository(database.DB)
	journalService := service.NewJournalService(journalRepo, gamificationService)
	h := handler.NewJournalHandler(journalService)

	journal := api.Group("/journals", auth.TokenMiddleware)

	journal.Get("/me", h.ListByUserID)
	journal.Post("/", h.Create)
	journal.Get("/:id", h.GetByID)
	journal.Put("/:id", h.Update)
	journal.Delete("/:id", h.Delete)
}
