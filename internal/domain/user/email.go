package user

import (
	"regexp"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

type Email struct {
	value string
}

func NewEmail(email string) (Email, error) {
	if email == "" {
		return Email{}, ErrInvalidEmail
	}

	if !isValidEmail(email) {
		return Email{}, ErrInvalidEmail
	}

	return Email{value: email}, nil
}

func (e Email) String() string {
	return e.value
}

func isValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}
