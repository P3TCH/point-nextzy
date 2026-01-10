package routes

import (
	"nextzy/point-api/modules/health"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Register(db *gorm.DB) {
  r := gin.Default()

  health.Register(r, db)

  r.Run(":8080")
}
