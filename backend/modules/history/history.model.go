package history

import "time"

type GlobalHistory struct {
	ID       string    `gorm:"type:uuid;primaryKey" json:"id"`
	Nickname string    `json:"nickname"`
	Point    int       `json:"point"`
	PlayedAt time.Time `gorm:"column:played_at" json:"playedAt"`
}
