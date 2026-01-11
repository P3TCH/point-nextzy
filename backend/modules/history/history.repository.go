package history

import "gorm.io/gorm"

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetMyHistories(nickname string, limit int, offset int,) ([]GlobalHistory, error) {

	var histories []GlobalHistory

	err := r.db.
		Table("global_histories").
		Where("nickname = ?", nickname).
		Order("played_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&histories).Error

	return histories, err
}

func (r *Repository) GetPaginated(offset int) ([]GlobalHistory, error) {
	var histories []GlobalHistory

	err := r.db.
		Table("global_histories").
		Order("played_at DESC").
		Limit(10).
		Offset(offset).
		Find(&histories).Error

	return histories, err
}
