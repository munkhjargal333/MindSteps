package router

// import (
// 	"mindsteps/database"
// 	"mindsteps/internal/auth"
// 	"mindsteps/internal/goal/handler"
// 	"mindsteps/internal/goal/repository"
// 	"mindsteps/internal/goal/service"

// 	"github.com/gofiber/fiber/v2"
// )

// func RegisterGoalRoutes(api fiber.Router) {

// 	coreGoalRepo := repository.NewGoalRepository(database.DB)
// 	coreGoalService := service.NewGoalService(coreGoalRepo)
// 	h := handler.GoalHandler(coreGoalService)

// 	coreValue := api.Group("/core-values", auth.TokenMiddleware)

// 	coreValue.Get("/me", h.ListByUserID)
// 	coreValue.Post("/", h.Create)
// 	coreValue.Get("/:id", h.GetByID)
// 	coreValue.Put("/:id", h.Update)
// 	coreValue.Delete("/:id", h.Delete)
// }
