package history

import (
	"time"

	"github.com/google/uuid"
)

type GameHistory struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	PlayerID  uuid.UUID
	Point     int
	CreatedAt time.Time
}
