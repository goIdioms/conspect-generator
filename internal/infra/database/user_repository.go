package database

import (
	"context"
	"database/sql"
	"fmt"

	domainUser "github.com/goIdioms/conspect-generator/internal/domain/user"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindByID(ctx context.Context, id int) (*domainUser.User, error) {
	query := `
		SELECT id, google_id, email, verified_email, name, picture,
		       created_at, updated_at, last_login_at
		FROM users
		WHERE id = $1
	`

	var user domainUser.User
	var emailStr, googleIDStr string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&googleIDStr,
		&emailStr,
		&user.VerifiedEmail,
		&user.Name,
		&user.Picture,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.LastLoginAt,
	)

	if err == sql.ErrNoRows {
		return nil, domainUser.ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user by ID: %w", err)
	}

	user.GoogleID, _ = domainUser.NewGoogleID(googleIDStr)
	user.Email, _ = domainUser.NewEmail(emailStr)

	return &user, nil
}

func (r *UserRepository) FindByGoogleID(ctx context.Context, googleID domainUser.GoogleID) (*domainUser.User, error) {
	query := `
		SELECT id, google_id, email, verified_email, name, picture,
		       created_at, updated_at, last_login_at
		FROM users
		WHERE google_id = $1
	`

	var user domainUser.User
	var emailStr, googleIDStr string

	err := r.db.QueryRowContext(ctx, query, googleID.String()).Scan(
		&user.ID,
		&googleIDStr,
		&emailStr,
		&user.VerifiedEmail,
		&user.Name,
		&user.Picture,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.LastLoginAt,
	)

	if err == sql.ErrNoRows {
		return nil, domainUser.ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user by Google ID: %w", err)
	}

	user.GoogleID, _ = domainUser.NewGoogleID(googleIDStr)
	user.Email, _ = domainUser.NewEmail(emailStr)

	return &user, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email domainUser.Email) (*domainUser.User, error) {
	query := `
		SELECT id, google_id, email, verified_email, name, picture,
		       created_at, updated_at, last_login_at
		FROM users
		WHERE email = $1
	`

	var user domainUser.User
	var emailStr, googleIDStr string

	err := r.db.QueryRowContext(ctx, query, email.String()).Scan(
		&user.ID,
		&googleIDStr,
		&emailStr,
		&user.VerifiedEmail,
		&user.Name,
		&user.Picture,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.LastLoginAt,
	)

	if err == sql.ErrNoRows {
		return nil, domainUser.ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user by email: %w", err)
	}

	user.GoogleID, _ = domainUser.NewGoogleID(googleIDStr)
	user.Email, _ = domainUser.NewEmail(emailStr)

	return &user, nil
}

func (r *UserRepository) Create(ctx context.Context, user *domainUser.User) error {
	query := `
		INSERT INTO users (google_id, email, verified_email, name, picture, last_login_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		user.GoogleID.String(),
		user.Email.String(),
		user.VerifiedEmail,
		user.Name,
		user.Picture,
		user.LastLoginAt,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

func (r *UserRepository) Update(ctx context.Context, user *domainUser.User) error {
	query := `
		UPDATE users
		SET email = $1, verified_email = $2, name = $3, picture = $4,
		    last_login_at = $5, updated_at = CURRENT_TIMESTAMP
		WHERE id = $6
		RETURNING updated_at
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		user.Email.String(),
		user.VerifiedEmail,
		user.Name,
		user.Picture,
		user.LastLoginAt,
		user.ID,
	).Scan(&user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}

func (r *UserRepository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM users WHERE id = $1`
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %w", err)
	}

	if rows == 0 {
		return domainUser.ErrUserNotFound
	}

	return nil
}
