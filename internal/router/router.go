package router

import (
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/goIdioms/conspect-generator/internal/config"
	"github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/goIdioms/conspect-generator/internal/handlers"
	"github.com/goIdioms/conspect-generator/internal/services"
	"github.com/sirupsen/logrus"
)

type Router struct {
	Router          chi.Router
	Logger          *logrus.Logger
	RateLimit       string
	RateLimitWindow string
	MaxBodySize     string
	AudioHandler    *handlers.AudioHandler
	AuthHandler     *handlers.AuthHandler
}

func NewRouter() *Router {
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})

	oauthCfg := &config.OAuthConfig{
		Google: config.GoogleOAuthConfig{
			ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
			ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
			RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
			Scopes:       constants.DefaultOAuthScopes,
		},
	}

	authService := services.NewAuthService(oauthCfg, logger)
	frontendURL := os.Getenv("FRONTEND_URL")

	return &Router{
		Router:          chi.NewRouter(),
		Logger:          logger,
		RateLimit:       os.Getenv("RATE_LIMIT_REQUESTS"),
		RateLimitWindow: os.Getenv("RATE_LIMIT_WINDOW"),
		MaxBodySize:     os.Getenv("MAX_BODY_SIZE"),
		AudioHandler:    handlers.NewAudioHandler(logger),
		AuthHandler:     handlers.NewAuthHandler(authService, logger, frontendURL),
	}
}

func (r *Router) SetupRoutes() {
	r.Router.Get("/", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("Healthy"))
	})
	r.Router.Post("/audio", r.AudioHandler.Handle)

	r.Router.Get("/auth/google/login", r.AuthHandler.GoogleLogin)
	r.Router.Get("/auth/google/callback", r.AuthHandler.GoogleCallback)
}
