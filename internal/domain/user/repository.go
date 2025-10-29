package user

import "context"

type Repository interface {
	FindByID(ctx context.Context, id int) (*User, error)
	FindByGoogleID(ctx context.Context, googleID GoogleID) (*User, error)
	FindByEmail(ctx context.Context, email Email) (*User, error)
	Create(ctx context.Context, user *User) error
	Update(ctx context.Context, user *User) error
	Delete(ctx context.Context, id int) error
}
