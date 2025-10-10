package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/goIdioms/conspect-generator/internal/services"
	"github.com/sirupsen/logrus"
)

type AuthHandler struct {
	authService *services.AuthService
	logger      *logrus.Logger
	frontendURL string
}

func NewAuthHandler(authService *services.AuthService, logger *logrus.Logger, frontendURL string) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		logger:      logger,
		frontendURL: frontendURL,
	}
}

func (h *AuthHandler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	state := generateState()

	cookie := &http.Cookie{
		Name:     constants.CookieStateName,
		Value:    state,
		MaxAge:   constants.CookieMaxAge,
		HttpOnly: constants.CookieHttpOnly,
		Secure:   constants.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	}
	http.SetCookie(w, cookie)

	authURL := h.authService.GetAuthURL(state)
	http.Redirect(w, r, authURL, http.StatusTemporaryRedirect)
}

func (h *AuthHandler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")
	errorParam := r.URL.Query().Get("error")

	if errorParam != "" {
		h.logger.Errorf("Google OAuth error: %s", errorParam)
		h.redirectToFrontendWithError(w, r, fmt.Sprintf("Google OAuth error: %s", errorParam))
		return
	}

	if code == "" {
		h.logger.Error("No code in callback request")
		h.redirectToFrontendWithError(w, r, "No authorization code received")
		return
	}

	if !h.validateState(r, state) {
		h.logger.Error("Invalid OAuth state")
		h.redirectToFrontendWithError(w, r, "Invalid authorization state")
		return
	}

	token, err := h.authService.ExchangeCode(r.Context(), code)
	if err != nil {
		h.logger.Errorf("Failed to exchange code: %v", err)
		h.redirectToFrontendWithError(w, r, "Failed to exchange token")
		return
	}

	userInfo, err := h.authService.GetUserInfo(r.Context(), token)
	if err != nil {
		h.logger.Errorf("Failed to get user info: %v", err)
		h.redirectToFrontendWithError(w, r, "Failed to get user info")
		return
	}

	h.clearStateCookie(w)
	h.redirectToFrontendWithUser(w, r, userInfo, token.AccessToken)
}

func (h *AuthHandler) redirectToFrontendWithUser(w http.ResponseWriter, r *http.Request, user *services.GoogleUser, token string) {
	userJSON, err := json.Marshal(user)
	if err != nil {
		h.logger.Errorf("Failed to marshal user: %v", err)
		h.redirectToFrontendWithError(w, r, "Internal error")
		return
	}

	redirectURL := fmt.Sprintf("%s/auth/callback?user=%s&token=%s",
		h.frontendURL,
		url.QueryEscape(string(userJSON)),
		url.QueryEscape(token),
	)

	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}

func (h *AuthHandler) redirectToFrontendWithError(w http.ResponseWriter, r *http.Request, errorMsg string) {
	redirectURL := fmt.Sprintf("%s/auth/callback?error=%s",
		h.frontendURL,
		url.QueryEscape(errorMsg),
	)
	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}

func (h *AuthHandler) validateState(r *http.Request, receivedState string) bool {
	cookie, err := r.Cookie(constants.CookieStateName)
	if err != nil {
		return false
	}
	return cookie.Value == receivedState
}

func (h *AuthHandler) clearStateCookie(w http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:   constants.CookieStateName,
		Value:  "",
		MaxAge: -1,
		Path:   "/",
	}
	http.SetCookie(w, cookie)
}

func generateState() string {
	b := make([]byte, constants.StateLength)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}
