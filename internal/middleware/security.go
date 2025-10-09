package middleware

import (
	"net/http"

	c "github.com/goIdioms/conspect-generator/internal/constants"
)

func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set(c.HeaderXContentTypeOptions, c.XContentTypeOptionsNoSniff)
		w.Header().Set(c.HeaderXFrameOptions, c.XFrameOptionsDeny)
		w.Header().Set(c.HeaderXXSSProtection, c.XXSSProtectionBlock)
		w.Header().Set(c.HeaderCSP, c.CSPDefaultSelf)
		w.Header().Set(c.HeaderReferrerPolicy, c.ReferrerPolicyStrictOrigin)
		w.Header().Set(c.HeaderPermissionsPolicy, c.PermissionsPolicyRestrict)

		next.ServeHTTP(w, r)
	})
}

func CORS(allowedOrigins []string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get(c.HeaderOrigin)

			allowed := false
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					allowed = true
					break
				}
			}

			if allowed {
				w.Header().Set(c.HeaderAccessControlAllowOrigin, origin)
				w.Header().Set(c.HeaderAccessControlAllowMethods, c.CORSAllowMethods)
				w.Header().Set(c.HeaderAccessControlAllowHeaders, c.CORSAllowHeaders)
				w.Header().Set(c.HeaderAccessControlMaxAge, c.CORSMaxAge)
			}

			if r.Method == c.MethodOPTIONS {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func MaxBodySize(maxSize int64) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r.Body = http.MaxBytesReader(w, r.Body, maxSize)
			next.ServeHTTP(w, r)
		})
	}
}
