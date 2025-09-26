package routers

import (
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {

	app.Route("", func(router fiber.Router) {
		router.Get("/health", func(c *fiber.Ctx) error {
			return c.SendStatus(fiber.StatusOK)
		})

		router.Route("auth", func(router fiber.Router) {
			//	router.Post("forget-password", handlers.ForgetPassword)
			//	router.Post("otp-check", handlers.CheckOtpCode)
			//	router.Post("change-password", auth.TokenMiddleware, handlers.ChangePassword)
			// router.Get("me", auth.TokenMiddleware) //handlers.SystemUserMe
			// router.Post("login")                   //handlers.AuthLogin
		})

		// // simple notes
		// router.Group("note", auth.TokenMiddleware).Route("", func(r fiber.Router) {
		// 	r.Post("/") // create (daily/thanks/meditation)
		// 	r.Get("/")  // list
		// 	r.Get("/:id")
		// 	r.Patch("/:id")
		// 	r.Delete("/:id")
		// })

		// // mood notes
		// // id
		// router.Group("mood", auth.TokenMiddleware).Route("", func(r fiber.Router) {
		// 	r.Post("/")
		// 	r.Get("/")
		// 	r.Get("/:id")
		// 	r.Patch("/:id")
		// 	r.Delete("/:id")
		// })

		// // todo notes
		// router.Group("todo", auth.TokenMiddleware).Route("", func(r fiber.Router) {
		// 	r.Post("/")
		// 	r.Get("/")
		// 	r.Get("/:id")
		// 	r.Patch("/:id")
		// 	r.Delete("/:id")
		// })

		// // core values
		// router.Group("core-values", auth.TokenMiddleware).Route("", func(r fiber.Router) {
		// 	r.Post("/")
		// 	r.Get("/")
		// 	r.Get("/:id")
		// 	r.Patch("/:id")
		// 	r.Delete("/:id")
		// })

		// // талархлын тэмдэглэл
		// router.Group("thanks", auth.TokenMiddleware).Route("", func(router fiber.Router) {
		// 	router.Post("write")
		// 	router.Get("list")
		// 	router.Get("list/:id")
		// 	router.Delete(":id")
		// 	router.Patch("update")
		// })

		// router.Group("notification", auth.TokenMiddleware).Route("", func(router fiber.Router) {
		// 	router.Get("", handlers.UserNotification)
		// 	router.Post("", handlers.CreateNotification)
		// 	router.Post("test", handlers.TestNotifydamagedbin)
		// 	router.Get("list", handlers.CreatedNotifications)
		// 	router.Patch("token", handlers.UserUpdateFCMToken)
		// 	router.Patch(":id/seen", handlers.NotificationToSeen)
		// })

		// router.Group("system", auth.TokenMiddleware, auth.LogMiddleware).Route("user", func(router fiber.Router) {
		// 	router.Get("", handlers.SystemUserList)
		// 	router.Put("password", handlers.UserChangePassword)
		// 	router.Get(":id", handlers.SystemUserFind)
		// 	router.Post("", handlers.SystemUserCreate)
		// 	router.Put(":id", auth.FetchPreviousDataMiddleware, handlers.SystemUserUpdate)
		// 	router.Post(":id/soft-delete", handlers.SystemUserSoftDelete)
		// 	router.Post(":id/recovery", handlers.SystemUserRecovery)
		// 	router.Delete(":id", auth.FetchPreviousDataMiddleware, handlers.SystemUserDelete)
		// })

		// router.Group("role", auth.TokenMiddleware, auth.LogMiddleware).Route("", func(route fiber.Router) {
		// 	route.Get("", handlers.RoleList)
		// 	route.Get("list", handlers.GetRoles)
		// 	route.Post("", handlers.RoleCreate)
		// 	route.Get(":id", handlers.RoleGet)
		// 	route.Put(":id", auth.FetchPreviousDataMiddleware, handlers.RoleUpdate)
		// 	route.Delete(":id", auth.FetchPreviousDataMiddleware, handlers.RoleDelete)
		// 	route.Post(":id/soft-delete", handlers.RoleSoftDelete)
		// 	route.Post(":id/recovery", handlers.RoleRecovery)
		// })

		// router.Group("role-owner").Route("", func(route fiber.Router) {
		// 	route.Get("", handlers.RoleOwnerList)
		// 	route.Get(":id", handlers.OwnerIDByPermissionList)
		// 	route.Post("", handlers.RoleGrant)
		// 	route.Delete(":id", handlers.RoleRevoke)
		// })
	})
}
