package router

import (
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	c "github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/goIdioms/conspect-generator/internal/handlers"
	custommw "github.com/goIdioms/conspect-generator/internal/middleware"
	"github.com/sirupsen/logrus"
)

type Router struct {
	Router          chi.Router
	Logger          *logrus.Logger
	RateLimit       string
	RateLimitWindow string
	MaxBodySize     string
	AudioHandler    *handlers.AudioHandler
}

func NewRouter() *Router {
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})

	return &Router{
		Router:          chi.NewRouter(),
		Logger:          logger,
		RateLimit:       os.Getenv("RATE_LIMIT_REQUESTS"),
		RateLimitWindow: os.Getenv("RATE_LIMIT_WINDOW"),
		MaxBodySize:     os.Getenv("MAX_BODY_SIZE"),
		AudioHandler:    handlers.NewAudioHandler(logger),
	}
}

func (r *Router) SetupRoutes() {
	r.Router.Get("/", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("Healthy"))
	})
	r.Router.Post("/audio", r.AudioHandler.Handle)
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
		rateLimit = c.RateLimitRequests
	}

	rateLimitWindow, err := time.ParseDuration(r.RateLimitWindow)
	if err != nil {
		r.Logger.Warnf("Invalid RATE_LIMIT_WINDOW value: %v, using default 1m", err)
		rateLimitWindow = c.RateLimitWindow
	}

	rateLimiter := custommw.NewRateLimiter(rateLimit, rateLimitWindow, r.Logger)
	r.Router.Use(rateLimiter.Middleware)

	maxBodySize, err := strconv.ParseInt(r.MaxBodySize, 10, 64)
	if err != nil {
		r.Logger.Warnf("Invalid MAX_BODY_SIZE value: %v, using default 110MB", err)
		maxBodySize = c.MaxBodySize
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
