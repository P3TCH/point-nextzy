package game

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func Register(r *gin.Engine, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)

	r.POST("/game/spin", func(c *gin.Context) {
		var req struct {
			PlayerID string `json:"playerId"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request"})
			return
		}

		playerID, err := uuid.Parse(req.PlayerID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid player id"})
			return
		}

		point, total, err := service.Spin(playerID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"point":      point,
			"totalScore": total,
		})
	})
}
