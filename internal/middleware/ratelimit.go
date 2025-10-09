package middleware

import (
	"net/http"
	"sync"
	"time"

	c "github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/sirupsen/logrus"
)

type RateLimiter struct {
	requests map[string][]time.Time
	mu       sync.RWMutex
	limit    int
	window   time.Duration
	logger   *logrus.Logger
}

func NewRateLimiter(limit int, window time.Duration, logger *logrus.Logger) *RateLimiter {
	rl := &RateLimiter{
		requests: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
		logger:   logger,
	}

	go rl.cleanup()
	return rl
}

func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := getClientIP(r)

		if !rl.allow(ip) {
			rl.logger.Warnf("Rate limit exceeded for IP: %s", ip)
			http.Error(w, "Слишком много запросов. Попробуйте позже.", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (rl *RateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-rl.window)

	if _, exists := rl.requests[ip]; !exists {
		rl.requests[ip] = []time.Time{}
	}

	recentRequests := []time.Time{}
	for _, t := range rl.requests[ip] {
		if t.After(cutoff) {
			recentRequests = append(recentRequests, t)
		}
	}

	if len(recentRequests) >= rl.limit {
		return false
	}

	recentRequests = append(recentRequests, now)
	rl.requests[ip] = recentRequests

	return true
}

func (rl *RateLimiter) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		cutoff := time.Now().Add(-rl.window)
		for ip, requests := range rl.requests {
			recentRequests := []time.Time{}
			for _, t := range requests {
				if t.After(cutoff) {
					recentRequests = append(recentRequests, t)
				}
			}
			if len(recentRequests) == 0 {
				delete(rl.requests, ip)
			} else {
				rl.requests[ip] = recentRequests
			}
		}
		rl.mu.Unlock()
	}
}

func getClientIP(r *http.Request) string {
	ip := r.Header.Get(c.HeaderXForwardedFor)
	if ip != "" {
		return ip
	}

	ip = r.Header.Get(c.HeaderXRealIP)
	if ip != "" {
		return ip
	}

	return r.RemoteAddr
}
