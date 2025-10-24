package main

import (
	"net/http"
	"os"
	"os/signal"
	"syscall"

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

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-c
		r.Logger.Info("Shutting down server...")
		if err := r.Close(); err != nil {
			r.Logger.Errorf("Error closing database connection: %v", err)
		}
		os.Exit(0)
	}()

	r.Logger.Info("Starting server on port", os.Getenv("HTTP_ADDR"))
	if err := http.ListenAndServe(os.Getenv("HTTP_ADDR"), r.Router); err != nil {
		r.Logger.Fatalf("Server failed to start: %v", err)
	}
}

func main() {
	run()
}
