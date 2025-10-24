package constants

import "time"

const (
	HeaderOrigin        = "Origin"
	HeaderContentType   = "Content-Type"
	HeaderAuthorization = "Authorization"

	HeaderXForwardedFor = "X-Forwarded-For"
	HeaderXRealIP       = "X-Real-IP"

	HeaderXContentTypeOptions = "X-Content-Type-Options"
	HeaderXFrameOptions       = "X-Frame-Options"
	HeaderXXSSProtection      = "X-XSS-Protection"
	HeaderCSP                 = "Content-Security-Policy"
	HeaderReferrerPolicy      = "Referrer-Policy"
	HeaderPermissionsPolicy   = "Permissions-Policy"

	HeaderAccessControlAllowOrigin  = "Access-Control-Allow-Origin"
	HeaderAccessControlAllowMethods = "Access-Control-Allow-Methods"
	HeaderAccessControlAllowHeaders = "Access-Control-Allow-Headers"
	HeaderAccessControlMaxAge       = "Access-Control-Max-Age"

	HeaderContentDisposition = "Content-Disposition"

	ContentTypeJSON        = "application/json"
	ContentTypePDF         = "application/pdf"
	ContentTypeOctetStream = "application/octet-stream"

	XContentTypeOptionsNoSniff = "nosniff"
	XFrameOptionsDeny          = "DENY"
	XFrameOptionsSameOrigin    = "SAMEORIGIN"
	XXSSProtectionBlock        = "1; mode=block"
	CSPDefaultSelf             = "default-src 'self'"
	ReferrerPolicyStrictOrigin = "strict-origin-when-cross-origin"
	PermissionsPolicyRestrict  = "geolocation=(), microphone=(), camera=()"

	CORSAllowMethods = "POST, GET, OPTIONS"
	CORSAllowHeaders = "Content-Type, Authorization"
	CORSMaxAge       = "86400"

	MethodGET     = "GET"
	MethodPOST    = "POST"
	MethodOPTIONS = "OPTIONS"

	FormFieldFile  = "file"
	FormFieldPages = "pages"
	FormFieldNotes = "notes"

	TempFilePattern   = "audio-*.mp3"
	OutputPDFFileName = "notes.pdf"
	AttachmentPrefix  = "attachment; filename="

	MaxBodySize       = 110 * 1024 * 1024
	RateLimitRequests = 10
	RateLimitWindow   = 1 * time.Minute

	// Cookie constants
	CookieSessionName = "session_token"
	CookieMaxAge      = 24 * 60 * 60
	CookieHttpOnly    = true
	CookieSecure      = false
	CookieSameSite    = "Lax"
)
