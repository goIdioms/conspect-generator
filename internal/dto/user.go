package dto

import (
	"time"

	"github.com/goIdioms/conspect-generator/internal/domain/user"
)

type UserResponse struct {
	ID            int       `json:"id"`
	GoogleID      string    `json:"google_id"`
	Email         string    `json:"email"`
	VerifiedEmail bool      `json:"verified_email"`
	Name          string    `json:"name"`
	Picture       string    `json:"picture"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	LastLoginAt   time.Time `json:"last_login_at"`
}

func NewUserResponse(u *user.User) *UserResponse {
	return &UserResponse{
		ID:            u.ID,
		GoogleID:      u.GoogleID.String(),
		Email:         u.Email.String(),
		VerifiedEmail: u.VerifiedEmail,
		Name:          u.Name,
		Picture:       u.Picture,
		CreatedAt:     u.CreatedAt,
		UpdatedAt:     u.UpdatedAt,
		LastLoginAt:   u.LastLoginAt,
	}
}
