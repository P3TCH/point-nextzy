package reward

type Reward struct {
	ID         int    `gorm:"primaryKey"`
	Checkpoint int    `gorm:"uniqueIndex"`
	RewardName string
}
