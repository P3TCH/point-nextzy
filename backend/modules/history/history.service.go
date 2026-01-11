package history

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetGlobalHistories(page int) ([]GlobalHistory, error) {
	if page < 1 {
		page = 1
	}

	offset := (page - 1) * 10
	return s.repo.GetPaginated(offset)
}
