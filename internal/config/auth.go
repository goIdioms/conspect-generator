package config

type OAuthConfig struct {
	Google GoogleOAuthConfig
}

type GoogleOAuthConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
	Scopes       []string
}
