package player

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Register(r *gin.Engine, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)

	r.POST("/players", func(c *gin.Context) {
		var req struct {
			Nickname string `json:"nickname"`
		}

		if err := c.ShouldBindJSON(&req); err != nil || req.Nickname == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "nickname is required",
			})
			return
		}

		player, err := service.CreatePlayer(req.Nickname)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "cannot create player",
			})
			return
		}

		c.JSON(http.StatusCreated, player)
	})
}
