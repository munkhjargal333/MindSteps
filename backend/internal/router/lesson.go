package router

import (
	"mindsteps/database"
	"mindsteps/internal/lesson/handler"
	"mindsteps/internal/lesson/repository"
	"mindsteps/internal/lesson/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterLessonRoutes(api fiber.Router) {
	lessonRepo := repository.NewLessonRepository(database.DB)
	lessonService := service.NewLessonService(lessonRepo)
	lessonHandler := handler.NewLessonHandler(lessonService)

	lesson := api.Group("/lessons")
	lesson.Post("/", lessonHandler.Create)
	lesson.Get("/", lessonHandler.GetAll)
	lesson.Get("/:id", lessonHandler.GetByID)
	lesson.Put("/:id", lessonHandler.Update)
	lesson.Delete("/:id", lessonHandler.Delete)
}
