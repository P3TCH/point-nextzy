package reward

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func Register(r *gin.Engine, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(db, repo)

	r.GET("/rewards/status", func(c *gin.Context) {
		playerIDStr := c.Query("playerId")
		playerID, err := uuid.Parse(playerIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid playerId"})
			return
		}

		status, err := service.GetRewardStatus(playerID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}

		c.JSON(http.StatusOK, status)
	})

	r.POST("/rewards/claim", func(c *gin.Context) {
		var req struct {
			PlayerID   string `json:"playerId"`
			Checkpoint int    `json:"checkpoint"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request"})
			return
		}

		playerID, err := uuid.Parse(req.PlayerID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid playerId"})
			return
		}

		if err := service.ClaimReward(playerID, req.Checkpoint); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"checkpoint": req.Checkpoint,
			"claimed":    true,
		})
	})

	r.GET("/rewards/mine", func(c *gin.Context) {
		playerIDStr := c.Query("playerId")
		pageStr := c.DefaultQuery("page", "1")

		playerID, err := uuid.Parse(playerIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid playerId"})
			return
		}

		page, _ := strconv.Atoi(pageStr)
		if page < 1 {
			page = 1
		}

		limit := 10
		offset := (page - 1) * limit

		histories, err := repo.GetRewardHistoryByPlayer(playerID, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": histories,
		})
	})
}
