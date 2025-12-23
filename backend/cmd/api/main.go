package main

import (
	"context"
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
	"mindsteps/internal/router"
	"mindsteps/pkg/cloudflare"
	cache "mindsteps/pkg/redis"
)

func main() {
	config.MustLoad()
	database.MustConnect(logLevel.Info) //
	// firebase.MustLoad()
	// _, err := mqtt.MustLoad()
	// if err != nil {
	// 	println(err.Error())
	// }
	if _, err := cache.InitRedis(context.Background()); err != nil {
		fmt.Println("⚠️ Redis холбогдохгүй байна: %v", err)
	}
	defer cache.CloseRedis()

	err := cloudflare.Load()
	if err != nil {
		println(err.Error())
	}

	app := fiber.New(fiber.Config{
		BodyLimit: 100 * 1024 * 1024, // 100 MB
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	// CORS middleware нэмэх
	// app.Use(cors.New(cors.Config{
	// 	AllowOrigins: "https://mind-steps-two.vercel.app", // frontend URL
	// 	AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	// 	AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	// }))
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
	router.RegisterRoutes(app)

	err = app.Listen(fmt.Sprintf(`:8080`))
	if err != nil {
		log.Errorf("server stopped: %v", err)
	}

	log.Fatal(app.Listen(fmt.Sprintf(`:8080`)))
}
