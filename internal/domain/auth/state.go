package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
)

var ErrInvalidState = errors.New("invalid state")

type State struct {
	value string
}

func NewState(state string) (State, error) {
	if state == "" {
		return State{}, ErrInvalidState
	}
	return State{value: state}, nil
}

func GenerateState() State {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return State{value: base64.URLEncoding.EncodeToString(bytes)}
}

func (s State) String() string {
	return s.value
}

func (s State) Equals(other State) bool {
	return s.value == other.value
}
