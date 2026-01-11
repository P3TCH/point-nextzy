package player

import "gorm.io/gorm"

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(player *Player) error {
	return r.db.Create(player).Error
}

func (r *Repository) FindByID(id string) (*Player, error) {
	var player Player
	if err := r.db.First(&player, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &player, nil
}
