package database

import (
	"fmt"
	"log"
	"time"

	"mindsteps/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func MustConnect(logLevel logger.LogLevel) {
	// ctx := context.Background()
	config := config.Get()

	// Construct DSN for GORM and connection string for pgxpool
	dsn := fmt.Sprintf(
		`host=%s port=%d dbname=%s user=%s password=%s sslmode=require TimeZone=Asia/Ulaanbaatar search_path=%s`,
		config.DB.Host,
		config.DB.Port,
		config.DB.Name,
		config.DB.User,
		config.DB.Password,
		config.DB.Schema,
	)

	// Connect using GORM
	db, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{
			Logger: logger.Default.LogMode(logLevel),
			NowFunc: func() time.Time {
				return time.Now().In(time.FixedZone("Asia/Ulaanbaatar", 8*60*60))
			},
		},
	)
	if err != nil {
		log.Fatal("Failed to connect to database with GORM: \n", err)
	}
	DB = db
}
