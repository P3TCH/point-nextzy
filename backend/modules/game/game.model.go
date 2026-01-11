package game

import (
	"time"

	"github.com/google/uuid"
)

type Player struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	Nickname   string
	TotalScore int
	CreatedAt  time.Time
}

type GlobalHistory struct {
	ID       uuid.UUID `gorm:"type:uuid;primaryKey"`
	Nickname string
	Point    int
	PlayedAt time.Time
}
