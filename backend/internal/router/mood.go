package router

import (
	"mindsteps/database"
	"mindsteps/internal/auth"
	"mindsteps/internal/mood/handler"
	"mindsteps/internal/mood/repository"
	"mindsteps/internal/mood/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterMoodRoutes(api fiber.Router) {

	moodRepo := repository.NewMoodRepository(database.DB)
	moodService := service.NewMoodService(moodRepo)
	moodHandler := handler.NewMoodHandler(moodService)

	entryRepo := repository.NewMoodEntryRepository(database.DB)
	entryService := service.NewMoodEntryService(entryRepo)
	entryHandler := handler.NewMoodEntryHandler(entryService)

	//moods := api.Group("/moods", auth.TokenMiddleware)

	moods := api.Group("/moods", auth.TokenMiddleware)
	moods.Get("/me", moodHandler.List)
	moods.Post("/", moodHandler.Create)
	moods.Get("/categories", entryHandler.MoodCategories)
	moods.Get("/categories/:id", moodHandler.ListByCategoryID)
	moods.Get("/:id", moodHandler.GetByID)
	moods.Put("/:id", moodHandler.Update)
	moods.Delete("/:id", moodHandler.Delete)

	entries := api.Group("/mood-entries", auth.TokenMiddleware)
	entries.Get("/me", entryHandler.ListByUserID)
	entries.Post("/", entryHandler.Create)
	entries.Get("/:id", entryHandler.GetByID)
	entries.Put("/:id", entryHandler.Update)
	entries.Delete("/:id", entryHandler.Delete)

}
