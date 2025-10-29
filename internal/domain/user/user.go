package user

import "time"

type User struct {
	ID            int
	GoogleID      GoogleID
	Email         Email
	VerifiedEmail bool
	Name          string
	Picture       string
	CreatedAt     time.Time
	UpdatedAt     time.Time
	LastLoginAt   time.Time
}

func NewUser(googleID GoogleID, email Email, name, picture string, verifiedEmail bool) *User {
	now := time.Now()
	return &User{
		GoogleID:      googleID,
		Email:         email,
		Name:          name,
		Picture:       picture,
		VerifiedEmail: verifiedEmail,
		CreatedAt:     now,
		UpdatedAt:     now,
		LastLoginAt:   now,
	}
}

func (u *User) UpdateProfile(email Email, name, picture string, verified bool) {
	u.Email = email
	u.Name = name
	u.Picture = picture
	u.VerifiedEmail = verified
	u.LastLoginAt = time.Now()
	u.UpdatedAt = time.Now()
}

func (u *User) RecordLogin() {
	u.LastLoginAt = time.Now()
}

func (u *User) IsActive() bool {
	return time.Since(u.LastLoginAt) < 30*24*time.Hour
}

func (u *User) IsEmailVerified() bool {
	return u.VerifiedEmail
}
