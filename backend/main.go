package main

import (
	"nextzy/point-api/config"
	"nextzy/point-api/routes"
)

func main() {
	db := config.InitDB()
	routes.Register(db)
  }
