package main

import (
	"database/sql"
	"flag"
	"fmt"
	"os"

	"github.com/goIdioms/conspect-generator/internal/config"
	"github.com/goIdioms/conspect-generator/internal/infra/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
)

const (
	ActionUp     = "up"
	ActionDown   = "down"
	ActionStatus = "status"
)

func init() {
	_ = godotenv.Load()
}

func main() {
	var (
		action = flag.String("action", ActionUp, "Migration action: up, down, status")
		steps  = flag.Int("steps", 1, "Number of migrations to rollback (only for 'down')")
	)
	flag.Parse()

	logger := logrus.New()
	logger.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})

	cfg := config.NewDBConfig()
	dsn := cfg.GetDSN()

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		logger.Fatalf("Failed to ping database: %v", err)
	}

	migrator := database.NewMigrator(db, logger)

	switch *action {
	case ActionUp:
		logger.Info("Running migrations up...")
		if err := migrator.Up(); err != nil {
			logger.Fatalf("Failed to run migrations: %v", err)
		}
		logger.Info("Migrations completed successfully")

	case ActionDown:
		logger.Infof("Rolling back %d migration(s)...", *steps)
		if err := migrator.Down(*steps); err != nil {
			logger.Fatalf("Failed to rollback migrations: %v", err)
		}
		logger.Info("Rollback completed successfully")

	case ActionStatus:
		logger.Info("Checking migration status...")
		if err := migrator.Status(); err != nil {
			logger.Fatalf("Failed to get migration status: %v", err)
		}

	default:
		fmt.Printf("Unknown action: %s\n", *action)
		fmt.Println("Available actions: up, down, status")
		os.Exit(1)
	}
}
