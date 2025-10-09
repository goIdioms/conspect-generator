package main

import (
	"net/http"
	"os"

	"github.com/goIdioms/conspect-generator/internal/router"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv"
)

func init() {
	_ = godotenv.Load()
}

func run() {
	r := router.NewRouter()
	r.SetupMiddlewares()
	r.SetupRoutes()

	r.Logger.Info("Starting server on port", os.Getenv("HTTP_ADDR"))
	http.ListenAndServe(os.Getenv("HTTP_ADDR"), r.Router)
}

func main() {
	run()
}
