package session

import "time"

type Session struct {
	ID        int
	UserID    int
	Token     Token
	ExpiresAt time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewSession(userID int, token Token, duration time.Duration) *Session {
	now := time.Now()
	return &Session{
		UserID:    userID,
		Token:     token,
		ExpiresAt: now.Add(duration),
		CreatedAt: now,
		UpdatedAt: now,
	}
}

func (s *Session) IsExpired() bool {
	return time.Now().After(s.ExpiresAt)
}

func (s *Session) Renew(duration time.Duration) {
	s.ExpiresAt = time.Now().Add(duration)
	s.UpdatedAt = time.Now()
}
