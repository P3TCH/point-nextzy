package history

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Register(r *gin.Engine, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)

	r.GET("/histories/global", func(c *gin.Context) {
		pageStr := c.Query("page")
		offsetStr := c.Query("offset")

		page := 1

		if offsetStr != "" {
			if offset, err := strconv.Atoi(offsetStr); err == nil {
				page = (offset / 10) + 1
			}
		} else if pageStr != "" {
			if p, err := strconv.Atoi(pageStr); err == nil {
				page = p
			}
		}

		data, err := service.GetGlobalHistories(page)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "cannot fetch global histories",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"page":  page,
			"limit": 10,
			"data":  data,
		})
	})

	r.GET("/histories/mine", func(c *gin.Context) {
		nickname := c.Query("nickname")
		page := c.DefaultQuery("page", "1")

		if nickname == "" {
			c.JSON(400, gin.H{"message": "nickname is required"})
			return
		}

		pageInt, _ := strconv.Atoi(page)
		if pageInt < 1 {
			pageInt = 1
		}

		limit := 10
		offset := (pageInt - 1) * limit

		histories, err := repo.GetMyHistories(nickname, limit, offset)
		if err != nil {
			c.JSON(500, gin.H{"message": err.Error()})
			return
		}

		c.JSON(200, gin.H{
			"data": histories,
		})
	})
}
