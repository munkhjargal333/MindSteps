package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	logLevel "gorm.io/gorm/logger"

	"mindsteps/config"
	"mindsteps/database"
	"mindsteps/internal/auth"
	routers "mindsteps/routers"
)

func main() {
	config.MustLoad()
	database.MustConnect(logLevel.Info) //
	// firebase.MustLoad()
	// _, err := mqtt.MustLoad()
	// if err != nil {
	// 	println(err.Error())
	// }

	// err = minio.Load()
	// if err != nil {
	// 	println(err.Error())
	// }

	app := fiber.New(fiber.Config{
		BodyLimit: 8.5 * 1024 * 1024,
	})

	app.Use(cors.New())
	app.Use(logger.New(
		logger.Config{
			Format:     "${time} | ${status} | ${latency} | ${ip} | ${method} | ${path} | ${error}\n",
			TimeFormat: "2006-01-02 15:04:05",
			Next: func(c *fiber.Ctx) bool {
				if url := c.OriginalURL(); url == "/health" {
					return true
				}

				return false
			},
		},
	))

	app.Use(recover.New())

	auth.MustInitGjwt()
	routers.RegisterRoutes(app)

	err := app.Listen(fmt.Sprintf(`:8080`))
	if err != nil {
		log.Errorf("server stopped: %v", err)
	}

	log.Fatal(app.Listen(fmt.Sprintf(`:8080`)))
}
