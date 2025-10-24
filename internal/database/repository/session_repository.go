package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/goIdioms/conspect-generator/internal/models"
)

type SessionRepository struct {
	db *sql.DB
}

func NewSessionRepository(db *sql.DB) *SessionRepository {
	return &SessionRepository{db: db}
}

func (r *SessionRepository) Create(userID int, token string, expiresAt time.Time) (*models.UserSession, error) {
	session := &models.UserSession{
		UserID:    userID,
		Token:     token,
		ExpiresAt: expiresAt,
	}

	query := `INSERT INTO user_sessions (user_id, token, expires_at)
			  VALUES ($1, $2, $3)
			  RETURNING id, created_at, updated_at`

	err := r.db.QueryRow(query, session.UserID, session.Token, session.ExpiresAt).
		Scan(&session.ID, &session.CreatedAt, &session.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	return session, nil
}

func (r *SessionRepository) FindByToken(token string) (*models.UserSession, error) {
	session := &models.UserSession{}
	query := `SELECT id, user_id, token, expires_at, created_at, updated_at
			  FROM user_sessions
			  WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP`

	err := r.db.QueryRow(query, token).Scan(
		&session.ID, &session.UserID, &session.Token,
		&session.ExpiresAt, &session.CreatedAt, &session.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("session not found or expired")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find session: %w", err)
	}

	return session, nil
}

func (r *SessionRepository) FindByUserID(userID int) ([]*models.UserSession, error) {
	query := `SELECT id, user_id, token, expires_at, created_at, updated_at
			  FROM user_sessions
			  WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP
			  ORDER BY created_at DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to find sessions by user ID: %w", err)
	}
	defer rows.Close()

	var sessions []*models.UserSession
	for rows.Next() {
		session := &models.UserSession{}
		err := rows.Scan(
			&session.ID, &session.UserID, &session.Token,
			&session.ExpiresAt, &session.CreatedAt, &session.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan session: %w", err)
		}
		sessions = append(sessions, session)
	}

	return sessions, nil
}

func (r *SessionRepository) Delete(token string) error {
	query := `DELETE FROM user_sessions WHERE token = $1`
	result, err := r.db.Exec(query, token)
	if err != nil {
		return fmt.Errorf("failed to delete session: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %w", err)
	}

	if rows == 0 {
		return fmt.Errorf("session not found")
	}

	return nil
}

func (r *SessionRepository) DeleteByUserID(userID int) error {
	query := `DELETE FROM user_sessions WHERE user_id = $1`
	_, err := r.db.Exec(query, userID)
	if err != nil {
		return fmt.Errorf("failed to delete sessions: %w", err)
	}

	return nil
}

func (r *SessionRepository) CleanExpired() (int64, error) {
	query := `DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP`
	result, err := r.db.Exec(query)
	if err != nil {
		return 0, fmt.Errorf("failed to clean expired sessions: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("failed to get affected rows: %w", err)
	}

	return rows, nil
}
