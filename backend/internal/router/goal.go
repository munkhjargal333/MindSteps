package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth"
	"mindsteps/internal/goal/handler"
	"mindsteps/internal/goal/repository"
	"mindsteps/internal/goal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterGoalRoutes(api fiber.Router) {
	goalRepo := repository.NewGoalRepository(database.DB)
	goalService := service.NewGoalService(goalRepo)
	h := handler.NewGoalHandler(goalService)

	goal := api.Group("/goals", auth.TokenMiddleware)

	// Goal CRUD
	goal.Get("/me", h.ListByUserID)
	//goal.Get("/statistics", h.GetStatistics)
	goal.Post("/", h.Create)
	goal.Get("/:id", h.GetByID)
	goal.Put("/:id", h.Update)
	goal.Delete("/:id", h.Delete)

	// Goal status management
	// goal.Post("/:id/pause", h.PauseGoal)
	// goal.Post("/:id/resume", h.ResumeGoal)

	// Milestone CRUD
	goal.Post("/:id/milestones", h.CreateMilestone)
	goal.Put("/milestones/:milestone_id", h.UpdateMilestone)
	//goal.Delete("/milestones/:milestone_id", h.DeleteMilestone)
	goal.Post("/milestones/:milestone_id/complete", h.CompleteMilestone)
}
