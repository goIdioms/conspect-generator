package constants

const (
	GoogleOAuthScopes = "profile email"

	CookieStateName = "oauth_state"
	CookieMaxAge    = 300
	CookieHttpOnly  = true
	CookieSecure    = false
	CookieSameSite  = "Lax"

	StateLength = 16

	GoogleUserInfoURL = "https://www.googleapis.com/oauth2/v2/userinfo"
)

var DefaultOAuthScopes = []string{"profile", "email"}
