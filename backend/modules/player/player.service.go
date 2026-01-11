package player

import "github.com/google/uuid"

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreatePlayer(nickname string) (*Player, error) {
	player := &Player{
		ID:         uuid.New(),
		Nickname:   nickname,
		TotalScore: 0,
	}

	if err := s.repo.Create(player); err != nil {
		return nil, err
	}

	return player, nil
}
