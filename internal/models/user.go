package models

import (
	"time"
)

type User struct {
	ID            int       `json:"id" db:"id"`
	GoogleID      string    `json:"google_id" db:"google_id"`
	Email         string    `json:"email" db:"email"`
	VerifiedEmail bool      `json:"verified_email" db:"verified_email"`
	Name          string    `json:"name" db:"name"`
	Picture       string    `json:"picture" db:"picture"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
	LastLoginAt   time.Time `json:"last_login_at" db:"last_login_at"`
}

type UserSession struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"user_id" db:"user_id"`
	Token     string    `json:"token" db:"token"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
