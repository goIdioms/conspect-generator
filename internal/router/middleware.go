package router

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/goIdioms/conspect-generator/internal/constants"
	custommw "github.com/goIdioms/conspect-generator/internal/middleware"
)

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
	return strings.Split(originsEnv, ",")
}
