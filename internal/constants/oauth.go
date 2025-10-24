package constants

var DefaultOAuthScopes = []string{"profile", "email"}

const (
	GoogleOAuthScopes = "profile email"
	CookieStateName   = "oauth_state"
	StateLength       = 16
	GoogleUserInfoURL = "https://www.googleapis.com/oauth2/v2/userinfo"
)
