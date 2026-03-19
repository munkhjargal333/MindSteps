package form

// UserDashboardResponse - Дашбордын нэгдсэн хариулт
type UserDashboardResponse struct {
	Stats            UserActivityStats  `json:"stats"`
	CategoryProgress []CategoryProgress `json:"category_progress"`
	PlutchikWheel    []PlutchikStat     `json:"plutchik_wheel"`
}

// UserActivityStats - Ерөнхий статистик тоолуур
type UserActivityStats struct {
	TotalJournals int64 `json:"total_journals"`
	TotalMoods    int64 `json:"total_moods"`
	TotalLessons  int64 `json:"total_lessons_completed"`
}

// CategoryProgress - Хичээлийн явц ангилал бүрээр
type CategoryProgress struct {
	CategoryID       int     `json:"category_id"`
	CategoryName     string  `json:"category_name"`
	Emoji            string  `json:"emoji"`
	TotalLessons     int     `json:"total_lessons"`
	CompletedLessons int     `json:"completed_lessons"`
	ProgressPercent  float64 `json:"progress_percent"`
}

// PlutchikStat - Плутчикийн 8 тэнхлэгийн өгөгдөл
type PlutchikStat struct {
	EmotionID     int     `json:"emotion_id"`
	EmotionNameMn string  `json:"emotion_name_mn"`
	Color         string  `json:"color"`
	Emoji         string  `json:"emoji"`
	Count         float64 `json:"count"`         // Жинлэсэн давтамж (0.5, 1.0 г.м)
	AvgIntensity  float64 `json:"avg_intensity"` // Дундаж эрчим
}
