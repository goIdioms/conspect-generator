package router

import (
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/goIdioms/conspect-generator/internal/config"
	"github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/goIdioms/conspect-generator/internal/handlers"
	custommw "github.com/goIdioms/conspect-generator/internal/middleware"
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

func (r *Router) SetupMiddlewares() {
	r.Router.Use(middleware.RequestID)
	r.Router.Use(middleware.RealIP)
	r.Router.Use(middleware.Logger)
	r.Router.Use(middleware.Recoverer)

	r.Router.Use(middleware.Timeout(10 * time.Minute))
	r.Router.Use(custommw.SecurityHeaders)
	r.Router.Use(custommw.CORS(getAllowedOrigins()))

	rateLimit, err := strconv.Atoi(r.RateLimit)
	if err != nil {
		r.Logger.Warnf("Invalid RATE_LIMIT_REQUESTS value: %v, using default 10", err)
		rateLimit = constants.RateLimitRequests
	}

	rateLimitWindow, err := time.ParseDuration(r.RateLimitWindow)
	if err != nil {
		r.Logger.Warnf("Invalid RATE_LIMIT_WINDOW value: %v, using default 1m", err)
		rateLimitWindow = constants.RateLimitWindow
	}

	rateLimiter := custommw.NewRateLimiter(rateLimit, rateLimitWindow, r.Logger)
	r.Router.Use(rateLimiter.Middleware)

	maxBodySize, err := strconv.ParseInt(r.MaxBodySize, 10, 64)
	if err != nil {
		r.Logger.Warnf("Invalid MAX_BODY_SIZE value: %v, using default 110MB", err)
		maxBodySize = constants.MaxBodySize
	}

	r.Router.Use(custommw.MaxBodySize(maxBodySize))
}

func getAllowedOrigins() []string {
	originsEnv := os.Getenv("ALLOWED_ORIGINS")
	if originsEnv == "" {
		return []string{
			"http://localhost:4000",
		}
	}

	return strings.Split(originsEnv, ",")
}
