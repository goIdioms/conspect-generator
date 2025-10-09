package main

import (
	"fmt"
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

	fmt.Println("Starting server on port", os.Getenv("HTTP_ADDR"))
	http.ListenAndServe(os.Getenv("HTTP_ADDR"), r.Router)
}

func main() {
	run()
}
