package database

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/goIdioms/conspect-generator/internal/config"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
)

type Database struct {
	db     *sql.DB
	logger *logrus.Logger
}

func New(cfg *config.DBConfig, logger *logrus.Logger) (*Database, error) {
	dsn := cfg.GetDSN()

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	database := &Database{
		db:     db,
		logger: logger,
	}

	if err := database.runMigrations(); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	logger.Info("Database connected and migrations applied successfully")

	return database, nil
}

func (d *Database) runMigrations() error {
	migrator := NewMigrator(d.db, d.logger)
	return migrator.Up()
}

func (d *Database) Close() error {
	return d.db.Close()
}

func (d *Database) GetDB() *sql.DB {
	return d.db
}
