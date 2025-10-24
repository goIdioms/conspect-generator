package database

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/goIdioms/conspect-generator/internal/config"
	"github.com/goIdioms/conspect-generator/internal/database/repository"
	"github.com/goIdioms/conspect-generator/internal/models"
	"github.com/goIdioms/conspect-generator/internal/services"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
)

type Database struct {
	db                *sql.DB
	logger            *logrus.Logger
	UserRepository    *repository.UserRepository
	SessionRepository *repository.SessionRepository
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
		db:                db,
		logger:            logger,
		UserRepository:    repository.NewUserRepository(db),
		SessionRepository: repository.NewSessionRepository(db),
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

func (d *Database) CreateOrUpdateUser(googleUser *services.GoogleUser) (*models.User, error) {
	user, err := d.UserRepository.FindByGoogleID(googleUser.ID)

	if err != nil && err.Error() == "user not found" {
		user, err = d.UserRepository.Create(
			googleUser.ID,
			googleUser.Email,
			googleUser.Name,
			googleUser.Picture,
			googleUser.VerifiedEmail,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
		d.logger.Infof("Created new user: %s (%s)", user.Name, user.Email)
		return user, nil
	}

	if err != nil {
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	user.Email = googleUser.Email
	user.VerifiedEmail = googleUser.VerifiedEmail
	user.Name = googleUser.Name
	user.Picture = googleUser.Picture
	user.LastLoginAt = time.Now()

	if err := d.UserRepository.Update(user); err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	d.logger.Infof("Updated user: %s (%s)", user.Name, user.Email)
	return user, nil
}

func (d *Database) GetUserByID(id int) (*models.User, error) {
	return d.UserRepository.FindByID(id)
}

func (d *Database) GetUserByGoogleID(googleID string) (*models.User, error) {
	return d.UserRepository.FindByGoogleID(googleID)
}

func (d *Database) CreateSession(userID int, token string, expiresAt time.Time) (*models.UserSession, error) {
	return d.SessionRepository.Create(userID, token, expiresAt)
}

func (d *Database) GetSessionByToken(token string) (*models.UserSession, error) {
	return d.SessionRepository.FindByToken(token)
}

func (d *Database) DeleteSession(token string) error {
	return d.SessionRepository.Delete(token)
}

func (d *Database) CleanExpiredSessions() error {
	count, err := d.SessionRepository.CleanExpired()
	if err != nil {
		return err
	}
	if count > 0 {
		d.logger.Infof("Cleaned %d expired sessions", count)
	}
	return nil
}
