package game

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

func (r *Repository) GetPlayer(id uuid.UUID) (*Player, error) {
	var player Player
	if err := r.db.
		Table("players").
		Where("id = ?", id).
		First(&player).Error; err != nil {
		return nil, err
	}
	return &player, nil
}

func (r *Repository) UpdateScore(id uuid.UUID, score int) error {
	return r.db.
		Table("players").
		Where("id = ?", id).
		Update("total_score", score).Error
}

func (r *Repository) CreateHistory(playerID uuid.UUID, point int) error {
	var player Player
	if err := r.db.
		Table("players").
		Select("nickname").
		Where("id = ?", playerID).
		First(&player).Error; err != nil {
		return err
	}

	history := GlobalHistory{
		ID:       uuid.New(),
		Nickname: player.Nickname,
		Point:    point,
		PlayedAt: time.Now(),
	}

	return r.db.
		Table("global_histories").
		Create(&history).Error
}
