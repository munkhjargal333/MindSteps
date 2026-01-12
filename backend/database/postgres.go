package database

import (
	"fmt"
	"log"
	"time"
	_ "time/tzdata"

	"mindsteps/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func MustConnect(logLevel logger.LogLevel) {
	cfg := config.Get()

	// 1. DSN тохиргоо - disable_prepared_statement=true нь Neon/PgBouncer-т заавал хэрэгтэй
	dsn := fmt.Sprintf(
		"host=%s port=%d dbname=%s user=%s password=%s sslmode=require TimeZone=Asia/Ulaanbaatar search_path=%s&disable_prepared_statement=true",
		cfg.DB.Host,
		cfg.DB.Port,
		cfg.DB.Name,
		cfg.DB.User,
		cfg.DB.Password,
		cfg.DB.Schema,
	)

	var db *gorm.DB
	var err error

	// 2. Retry Logic: DB "сэрэх" эсвэл түр зуурын сүлжээний алдааг давах (max 5 удаа оролдоно)
	for i := 1; i <= 5; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logLevel),
			// NowFunc: func() time.Time {
			// 	return time.Now().In(time.FixedZone("Asia/Ulaanbaatar", 8*60*60))
			// },
			// Write-ийн дараа заавал SELECT хийхгүй байх (Performance)
			SkipDefaultTransaction: true,
		})

		if err == nil {
			break
		}

		log.Printf("DB-рүү холбогдох оролдого %d бүтэлгүйтэв. 2 секунд хүлээж байна...", i)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatal("5 удаа оролдоод DB-д холбогдож чадсангүй: \n", err)
	}

	// 3. Connection Pool Tuning (Render Starter-т зориулсан)
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("sql.DB объект авч чадсангүй: ", err)
	}

	// Render Starter (512MB RAM) болон Neon Free-д зориулсан утгууд:
	sqlDB.SetMaxOpenConns(15)                  // Нийт 15 холболтоос хэтрүүлэхгүй
	sqlDB.SetMaxIdleConns(5)                   // Сул байх холболтыг багасгаж RAM хэмнэнэ
	sqlDB.SetConnMaxLifetime(10 * time.Minute) // Холболтыг шинэчилж байх (Neon proxy-д хэрэгтэй)
	sqlDB.SetConnMaxIdleTime(5 * time.Minute)

	DB = db
	log.Println("Database connection successfully established and tuned.")
}
