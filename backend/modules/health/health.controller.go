package health

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Register(r *gin.Engine, db *gorm.DB) {
  r.GET("/health", func(c *gin.Context) {

    sqlDB, err := db.DB()
    if err != nil {
      c.JSON(http.StatusServiceUnavailable, gin.H{
        "status":   "error",
        "database": "down",
      })
      return
    }

    if err := sqlDB.Ping(); err != nil {
      c.JSON(http.StatusServiceUnavailable, gin.H{
        "status":   "error",
        "database": "down",
      })
      return
    }

    c.JSON(http.StatusOK, gin.H{
      "status":   "ok",
      "database": "up",
    })
  })
}
