package user

import "errors"

var (
	ErrUserNotFound   = errors.New("user not found")
	ErrInvalidEmail   = errors.New("invalid email format")
	ErrEmptyGoogleID  = errors.New("google ID cannot be empty")
	ErrDuplicateEmail = errors.New("email already exists")
)
