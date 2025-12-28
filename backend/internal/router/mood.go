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

	moodUnitRepo := repository.NewMoodUnitRepository(database.DB)
	moodUnitService := service.NewMoodUnitService(moodUnitRepo)
	moodUnitHandler := handler.NewMoodUnitHandler(moodUnitService)

	// Plutchik Combination repository, service, handler
	combRepo := repository.NewPlutchikCombinationRepository(database.DB)
	combService := service.NewPlutchikCombinationService(combRepo)
	combHandler := handler.NewPlutchikCombinationHandler(combService)

	//moods := api.Group("/moods", auth.TokenMiddleware)

	moods := api.Group("/moods/types", auth.TokenMiddleware)
	moods.Get("/categories", entryHandler.MoodCategories)
	moods.Get("/categories/:id", moodHandler.ListByCategoryID)

	entries := api.Group("/mood-entries", auth.TokenMiddleware)
	entries.Get("/me", entryHandler.ListByUserID)
	entries.Post("/", entryHandler.Create)
	entries.Get("/:id", entryHandler.GetByID)
	entries.Put("/:id", entryHandler.Update)
	entries.Delete("/:id", entryHandler.Delete)

	moodUnits := api.Group("/mood-units", auth.TokenMiddleware)
	moodUnits.Get("/", moodUnitHandler.List)
	moodUnits.Get("/:id", moodUnitHandler.GetByID)
	moodUnits.Get("/category/:categoryId", moodUnitHandler.ListByCategoryID)
	moodUnits.Get("/type/:type", moodUnitHandler.ListByType)

	// Plutchik combinations - read access for authenticated users
	combinations := api.Group("/plutchik-combinations", auth.TokenMiddleware)
	combinations.Get("/", combHandler.List)
	combinations.Get("/emotions", combHandler.EmotionList)
	combinations.Get("/:id", combHandler.GetByID)

	// ==================== ADMIN ONLY ROUTES ====================

	// Admin: Plutchik Combinations - update only
	adminCombo := api.Group("/admin/plutchik-combinations", auth.TokenMiddleware)
	adminCombo.Put("/:id", combHandler.Update)

}
