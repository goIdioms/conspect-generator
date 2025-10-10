package services

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/goIdioms/conspect-generator/internal/config"
	"github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/sirupsen/logrus"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthService struct {
	config *config.OAuthConfig
	oauth  *oauth2.Config
	logger *logrus.Logger
}

func NewAuthService(cfg *config.OAuthConfig, logger *logrus.Logger) *AuthService {
	return &AuthService{
		config: cfg,
		logger: logger,
		oauth: &oauth2.Config{
			ClientID:     cfg.Google.ClientID,
			ClientSecret: cfg.Google.ClientSecret,
			RedirectURL:  cfg.Google.RedirectURL,
			Scopes:       cfg.Google.Scopes,
			Endpoint:     google.Endpoint,
		},
	}
}

func (s *AuthService) GetAuthURL(state string) string {
	return s.oauth.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

func (s *AuthService) ExchangeCode(ctx context.Context, code string) (*oauth2.Token, error) {
	return s.oauth.Exchange(ctx, code)
}

func (s *AuthService) GetUserInfo(ctx context.Context, token *oauth2.Token) (*GoogleUser, error) {
	client := s.oauth.Client(ctx, token)
	resp, err := client.Get(constants.GoogleUserInfoURL)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}
	defer resp.Body.Close()

	var user GoogleUser
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, fmt.Errorf("failed to decode user info: %w", err)
	}
	return &user, nil
}

type GoogleUser struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}
