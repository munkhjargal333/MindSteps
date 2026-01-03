package router

import (
	"github.com/gofiber/fiber/v2"
)

// RegisterRoutes бүх API endpoint-уудыг бүртгэж, /api/v1 группийн дор нэгтгэнэ.
// Энэ нь төслийн үндсэн маршрутуудыг нэг газар төвлөрүүлж,
// кодын зохион байгуулалт болон өргөтгөх боломжийг сайжруулна.
//
// Бүртгэгдэж буй маршрутууд:
//   - AuthRoutes: хэрэглэгчийн нэвтрэлт, бүртгэл, токен
//   - UserRoutes: хэрэглэгчийн мэдээлэлтэй холбоотой үйлдлүүд
//   - JournalRoutes: тэмдэглэл, бичлэгийн CRUD
//   - CoreRoutes: үндсэн core value болон shared logic
//   - LessonRoutes: сургалтын материал, хичээлтэй холбоотой API
//   - MoodRoutes: хэрэглэгчийн сэтгэл санааны бүртгэл
//   - GoalRoutes: зорилго тодорхойлох, удирдах API
//
// Жич: RegisterCoreRoutes хоёр удаа дуудагдаж байгаа тул давхардал үүсэх магадлалтай,
// нэгийг нь хасах эсвэл ялгаатай нэртэйгээр зохион байгуулах шаардлагатай.
func RegisterRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	RegisterAuthRoutes(api)
	RegisterUserRoutes(api)
	RegisterjournalRoutes(api)
	RegisterCoreRoutes(api)
	RegisterLessonRoutes(api) // admin
	RegisterMoodRoutes(api)
	RegisterGoalRoutes(api)
	RegistergamificationRoutes(api)
	RegisterCacheRoutes(api)
}
