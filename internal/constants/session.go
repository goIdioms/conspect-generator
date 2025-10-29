package constants

import "time"

const (
	SessionDuration    = 24 * time.Hour
	SessionTokenLength = 32
	StateTokenLength   = 16
	CookieStateName    = "oauth_state"
	CookieSessionName  = "session_token"
)
