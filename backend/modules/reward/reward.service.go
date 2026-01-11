package reward

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Service struct {
	db   *gorm.DB
	repo *Repository
}

func NewService(db *gorm.DB, repo *Repository) *Service {
	return &Service{db: db, repo: repo}
}

func (s *Service) GetRewardStatus(playerID uuid.UUID) (map[int]bool, error) {
	rewards, err := s.repo.GetAllRewards()
	if err != nil {
		return nil, err
	}

	claimed, err := s.repo.GetClaimedByPlayer(playerID)
	if err != nil {
		return nil, err
	}

	claimedMap := map[int]bool{}
	for _, c := range claimed {
		claimedMap[c.RewardID] = true
	}

	result := map[int]bool{}
	for _, r := range rewards {
		result[r.Checkpoint] = claimedMap[r.ID]
	}

	return result, nil
}

func (s *Service) ClaimReward(playerID uuid.UUID, checkpoint int) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var reward Reward
		if err := tx.Where("checkpoint = ?", checkpoint).First(&reward).Error; err != nil {
			return errors.New("reward not found")
		}

		var player struct {
			ID         uuid.UUID
			TotalScore int
		}
		if err := tx.Table("players").
			Select("id, total_score").
			Where("id = ?", playerID).
			First(&player).Error; err != nil {
			return errors.New("player not found")
		}

		if player.TotalScore < checkpoint {
			return errors.New("score not enough")
		}

		var count int64
		tx.Model(&PlayerReward{}).
			Where("player_id = ? AND reward_id = ?", playerID, reward.ID).
			Count(&count)

		if count > 0 {
			return errors.New("reward already claimed")
		}

		pr := PlayerReward{
			ID:        uuid.New(),
			PlayerID:  playerID,
			RewardID:  reward.ID,
			ClaimedAt: time.Now(),
		}

		return tx.Create(&pr).Error
	})
}
