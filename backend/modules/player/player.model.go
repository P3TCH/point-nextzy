package player

import (
	"time"

	"github.com/google/uuid"
)

type Player struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Nickname   string    `gorm:"not null" json:"nickname"`
	TotalScore int       `gorm:"not null;default:0" json:"totalScore"`
	CreatedAt  time.Time `json:"createdAt"`
}
