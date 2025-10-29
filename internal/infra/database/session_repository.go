package database

import (
	"context"
	"database/sql"
	"fmt"

	domainSession "github.com/goIdioms/conspect-generator/internal/domain/session"
)

type SessionRepository struct {
	db *sql.DB
}

func NewSessionRepository(db *sql.DB) *SessionRepository {
	return &SessionRepository{db: db}
}

func (r *SessionRepository) FindByToken(ctx context.Context, token domainSession.Token) (*domainSession.Session, error) {
	query := `
		SELECT id, user_id, token, expires_at, created_at, updated_at
		FROM user_sessions
		WHERE token = $1
	`

	var session domainSession.Session
	var tokenStr string

	err := r.db.QueryRowContext(ctx, query, token.String()).Scan(
		&session.ID,
		&session.UserID,
		&tokenStr,
		&session.ExpiresAt,
		&session.CreatedAt,
		&session.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, domainSession.ErrSessionNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find session: %w", err)
	}

	session.Token, _ = domainSession.NewToken(tokenStr)
	return &session, nil
}

func (r *SessionRepository) FindByUserID(ctx context.Context, userID int) ([]*domainSession.Session, error) {
	query := `
		SELECT id, user_id, token, expires_at, created_at, updated_at
		FROM user_sessions
		WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to find sessions: %w", err)
	}
	defer rows.Close()

	var sessions []*domainSession.Session
	for rows.Next() {
		var session domainSession.Session
		var tokenStr string

		err := rows.Scan(
			&session.ID,
			&session.UserID,
			&tokenStr,
			&session.ExpiresAt,
			&session.CreatedAt,
			&session.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan session: %w", err)
		}

		session.Token, _ = domainSession.NewToken(tokenStr)
		sessions = append(sessions, &session)
	}

	return sessions, nil
}

func (r *SessionRepository) Create(ctx context.Context, session *domainSession.Session) error {
	query := `
		INSERT INTO user_sessions (user_id, token, expires_at)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		session.UserID,
		session.Token.String(),
		session.ExpiresAt,
	).Scan(&session.ID, &session.CreatedAt, &session.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create session: %w", err)
	}

	return nil
}

func (r *SessionRepository) Update(ctx context.Context, session *domainSession.Session) error {
	query := `
		UPDATE user_sessions
		SET expires_at = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
		RETURNING updated_at
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		session.ExpiresAt,
		session.ID,
	).Scan(&session.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to update session: %w", err)
	}

	return nil
}

func (r *SessionRepository) Delete(ctx context.Context, token domainSession.Token) error {
	query := `DELETE FROM user_sessions WHERE token = $1`
	result, err := r.db.ExecContext(ctx, query, token.String())
	if err != nil {
		return fmt.Errorf("failed to delete session: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %w", err)
	}

	if rows == 0 {
		return domainSession.ErrSessionNotFound
	}

	return nil
}

func (r *SessionRepository) DeleteByUserID(ctx context.Context, userID int) error {
	query := `DELETE FROM user_sessions WHERE user_id = $1`
	_, err := r.db.ExecContext(ctx, query, userID)
	if err != nil {
		return fmt.Errorf("failed to delete sessions: %w", err)
	}
	return nil
}

func (r *SessionRepository) CleanExpired(ctx context.Context) (int64, error) {
	query := `DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP`
	result, err := r.db.ExecContext(ctx, query)
	if err != nil {
		return 0, fmt.Errorf("failed to clean expired sessions: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("failed to get affected rows: %w", err)
	}

	return rows, nil
}
