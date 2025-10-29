package session

import "context"

type Repository interface {
	FindByToken(ctx context.Context, token Token) (*Session, error)
	FindByUserID(ctx context.Context, userID int) ([]*Session, error)
	Create(ctx context.Context, session *Session) error
	Update(ctx context.Context, session *Session) error
	Delete(ctx context.Context, token Token) error
	DeleteByUserID(ctx context.Context, userID int) error
	CleanExpired(ctx context.Context) (int64, error)
}
