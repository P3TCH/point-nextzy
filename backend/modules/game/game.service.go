package game

import (
	"errors"
	"math/rand"
	"time"

	"github.com/google/uuid"
)

var rewards = []int{300, 1000, 500, 3000}

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Spin(playerID uuid.UUID) (int, int, error) {
	rand.Seed(time.Now().UnixNano())

	reward := rewards[rand.Intn(len(rewards))]

	player, err := s.repo.GetPlayer(playerID)
	if err != nil {
		return 0, 0, errors.New("player not found")
	}

	newTotal := player.TotalScore + reward
	if newTotal > 10000 {
		newTotal = 10000
	}

	if err := s.repo.CreateHistory(playerID, reward); err != nil {
		return 0, 0, err
	}

	if err := s.repo.UpdateScore(playerID, newTotal); err != nil {
		return 0, 0, err
	}

	return reward, newTotal, nil
}
