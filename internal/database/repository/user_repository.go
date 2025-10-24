package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/goIdioms/conspect-generator/internal/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(googleID, email, name, picture string, verifiedEmail bool) (*models.User, error) {
	user := &models.User{
		GoogleID:      googleID,
		Email:         email,
		Name:          name,
		Picture:       picture,
		VerifiedEmail: verifiedEmail,
		LastLoginAt:   time.Now(),
	}

	query := `INSERT INTO users (google_id, email, verified_email, name, picture, last_login_at)
			  VALUES ($1, $2, $3, $4, $5, $6)
			  RETURNING id, created_at, updated_at`

	err := r.db.QueryRow(query, user.GoogleID, user.Email, user.VerifiedEmail, user.Name, user.Picture, user.LastLoginAt).
		Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return user, nil
}

func (r *UserRepository) Update(user *models.User) error {
	query := `UPDATE users
			  SET email = $1, verified_email = $2, name = $3, picture = $4,
			      last_login_at = $5, updated_at = CURRENT_TIMESTAMP
			  WHERE id = $6
			  RETURNING updated_at`

	err := r.db.QueryRow(query, user.Email, user.VerifiedEmail, user.Name, user.Picture, user.LastLoginAt, user.ID).
		Scan(&user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}

func (r *UserRepository) FindByID(id int) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, google_id, email, verified_email, name, picture, created_at, updated_at, last_login_at
			  FROM users WHERE id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&user.ID, &user.GoogleID, &user.Email, &user.VerifiedEmail,
		&user.Name, &user.Picture, &user.CreatedAt, &user.UpdatedAt, &user.LastLoginAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user by ID: %w", err)
	}

	return user, nil
}

func (r *UserRepository) FindByGoogleID(googleID string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, google_id, email, verified_email, name, picture, created_at, updated_at, last_login_at
			  FROM users WHERE google_id = $1`

	err := r.db.QueryRow(query, googleID).Scan(
		&user.ID, &user.GoogleID, &user.Email, &user.VerifiedEmail,
		&user.Name, &user.Picture, &user.CreatedAt, &user.UpdatedAt, &user.LastLoginAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user by Google ID: %w", err)
	}

	return user, nil
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, google_id, email, verified_email, name, picture, created_at, updated_at, last_login_at
			  FROM users WHERE email = $1`

	err := r.db.QueryRow(query, email).Scan(
		&user.ID, &user.GoogleID, &user.Email, &user.VerifiedEmail,
		&user.Name, &user.Picture, &user.CreatedAt, &user.UpdatedAt, &user.LastLoginAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user by email: %w", err)
	}

	return user, nil
}

func (r *UserRepository) Delete(id int) error {
	query := `DELETE FROM users WHERE id = $1`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %w", err)
	}

	if rows == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}
