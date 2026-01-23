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
		"host=%s port=%d dbname=%s user=%s password=%s sslmode=require TimeZone=Asia/Ulaanbaatar search_path=%s default_query_exec_mode=simple_protocol",
		cfg.DB.Host,
		cfg.DB.Port,
		cfg.DB.Name,
		cfg.DB.User,
		cfg.DB.Password,
		"mindstep", // search_path-аа энд зөв дамжуулж байгаа эсэхийг шалгаарай
	)

	var db *gorm.DB
	var err error

	// 2. Retry Logic: DB "сэрэх" эсвэл түр зуурын сүлжээний алдааг давах (max 5 удаа оролдоно)
	for i := 1; i <= 5; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			PrepareStmt: false,
			Logger:      logger.Default.LogMode(logLevel),
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

	sqlDB.SetMaxOpenConns(20) // Supabase нь илүү connection даах чадвартай
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(30 * time.Minute) // Proxy биш тул илүү урт хугацаа байж болно
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	DB = db
	log.Println("Database connection successfully established and tuned.")
}
