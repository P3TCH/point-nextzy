package routes

import (
	"nextzy/point-api/modules/game"
	"nextzy/point-api/modules/health"
	"nextzy/point-api/modules/history"
	"nextzy/point-api/modules/player"
	"nextzy/point-api/modules/reward"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func Register(db *gorm.DB) {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
	AllowOrigins:     []string{"*"},
	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
	AllowCredentials: true,
	}))

	player.Register(r, db)
	reward.Register(r, db)
	game.Register(r, db)
	history.Register(r, db)
	health.Register(r, db)

	r.Run(":8080")
}
