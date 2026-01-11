package reward

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

type PlayerRewardHistory struct {
	RewardID  int       `json:"rewardId"`
	ClaimedAt time.Time `json:"claimedAt"`
}

func (r *Repository) GetAllRewards() ([]Reward, error) {
	var rewards []Reward
	err := r.db.Find(&rewards).Error
	return rewards, err
}

func (r *Repository) GetClaimedByPlayer(playerID uuid.UUID) ([]PlayerReward, error) {
	var prs []PlayerReward
	err := r.db.Where("player_id = ?", playerID).Find(&prs).Error
	return prs, err
}

func (r *Repository) HasClaimed(playerID uuid.UUID, rewardID int) (bool, error) {
	var count int64
	err := r.db.Model(&PlayerReward{}).
		Where("player_id = ? AND reward_id = ?", playerID, rewardID).
		Count(&count).Error
	return count > 0, err
}

func (r *Repository) CreatePlayerReward(pr *PlayerReward) error {
	return r.db.Create(pr).Error
}

func (r *Repository) GetRewardHistoryByPlayer(
	playerID uuid.UUID,
	limit int,
	offset int,
) ([]PlayerRewardHistory, error) {

	var histories []PlayerRewardHistory

	err := r.db.
		Table("player_rewards").
		Select("reward_id, claimed_at").
		Where("player_id = ?", playerID).
		Order("claimed_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(&histories).Error

	return histories, err
}
