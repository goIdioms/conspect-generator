package session

import (
	"crypto/rand"
	"encoding/base64"
)

type Token struct {
	value string
}

func NewToken(token string) (Token, error) {
	if token == "" {
		return Token{}, ErrInvalidToken
	}
	return Token{value: token}, nil
}

func GenerateToken() Token {
	bytes := make([]byte, 32)
	rand.Read(bytes)
	return Token{value: base64.URLEncoding.EncodeToString(bytes)}
}

func (t Token) String() string {
	return t.value
}

func (t Token) Equals(other Token) bool {
	return t.value == other.value
}
