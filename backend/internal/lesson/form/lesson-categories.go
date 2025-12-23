package form

import "time"

type LessonCategoryForm struct {
	ID          int       `gorm:"column:id;type:integer;primaryKey;autoIncrement:true" json:"id"`
	ParentID    *int      `gorm:"column:parent_id;type:integer" json:"parent_id"`
	NameEn      string    `gorm:"column:name_en;type:character varying(100);not null" json:"name_en"`
	NameMn      string    `gorm:"column:name_mn;type:character varying(100);not null" json:"name_mn"`
	Description string    `gorm:"column:description;type:text" json:"description"`
	Icon        string    `gorm:"column:icon;type:character varying(50)" json:"icon"`
	Color       string    `gorm:"column:color;type:character varying(7)" json:"color"`
	SortOrder   int       `gorm:"column:sort_order;type:integer" json:"sort_order"`
	IsActive    bool      `gorm:"column:is_active;type:boolean;default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"column:created_at;type:timestamp without time zone;default:now()" json:"created_at"`
	Emoji       string    `gorm:"column:emoji;type:character varying(10)" json:"emoji"`
}
