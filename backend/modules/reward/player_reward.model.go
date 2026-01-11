package reward

import (
	"time"

	"github.com/google/uuid"
)

type PlayerReward struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	PlayerID  uuid.UUID `gorm:"index"`
	RewardID  int
	ClaimedAt time.Time
}
