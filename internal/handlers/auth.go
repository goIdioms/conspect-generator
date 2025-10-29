package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	sessionApp "github.com/goIdioms/conspect-generator/internal/application/session"
	userApp "github.com/goIdioms/conspect-generator/internal/application/user"
	"github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/goIdioms/conspect-generator/internal/domain/auth"
	"github.com/goIdioms/conspect-generator/internal/dto"
	"github.com/goIdioms/conspect-generator/internal/services"
	"github.com/sirupsen/logrus"
)

type AuthHandler struct {
	authService    *services.AuthService
	userService    *userApp.Service
	sessionService *sessionApp.Service
	logger         *logrus.Logger
	frontendURL    string
}

func NewAuthHandler(
	authService *services.AuthService,
	userService *userApp.Service,
	sessionService *sessionApp.Service,
	logger *logrus.Logger,
	frontendURL string,
) *AuthHandler {
	return &AuthHandler{
		authService:    authService,
		userService:    userService,
		sessionService: sessionService,
		logger:         logger,
		frontendURL:    frontendURL,
	}
}

func (h *AuthHandler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	state := auth.GenerateState()

	http.SetCookie(w, &http.Cookie{
		Name:     constants.CookieStateName,
		Value:    state.String(),
		MaxAge:   constants.CookieMaxAge,
		HttpOnly: constants.CookieHttpOnly,
		Secure:   constants.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	})

	authURL := h.authService.GetAuthURL(state.String())
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

	dbUser, err := h.userService.CreateOrUpdateUser(r.Context(), userInfo)
	if err != nil {
		h.logger.Errorf("Failed to save user to database: %v", err)
		h.redirectToFrontendWithError(w, r, "Failed to save user data")
		return
	}

	session, err := h.sessionService.CreateSession(r.Context(), dbUser.ID, constants.SessionDuration)
	if err != nil {
		h.logger.Errorf("Failed to create user session: %v", err)
		h.redirectToFrontendWithError(w, r, "Failed to create session")
		return
	}

	h.setSessionCookie(w, session.Token.String(), session.ExpiresAt)
	h.clearStateCookie(w)
	h.redirectToFrontendWithUser(w, r, userInfo, session.Token.String())
}

func (h *AuthHandler) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	sessionCookie, err := r.Cookie(constants.CookieSessionName)
	if err != nil {
		http.Error(w, "Session cookie not found", http.StatusUnauthorized)
		return
	}

	session, err := h.sessionService.ValidateSession(r.Context(), sessionCookie.Value)
	if err != nil {
		h.logger.Errorf("Failed to validate session: %v", err)
		http.Error(w, "Invalid session", http.StatusUnauthorized)
		return
	}

	user, err := h.userService.GetUserByID(r.Context(), session.UserID)
	if err != nil {
		h.logger.Errorf("Failed to get user: %v", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	response := dto.NewUserResponse(user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	sessionCookie, err := r.Cookie(constants.CookieSessionName)
	if err != nil {
		http.Error(w, "Session cookie not found", http.StatusBadRequest)
		return
	}

	if err := h.sessionService.DeleteSession(r.Context(), sessionCookie.Value); err != nil {
		h.logger.Errorf("Failed to delete session: %v", err)
		http.Error(w, "Failed to logout", http.StatusInternalServerError)
		return
	}

	h.clearSessionCookie(w)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logged out successfully"))
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

	expected, err := auth.NewState(cookie.Value)
	if err != nil {
		return false
	}

	received, err := auth.NewState(receivedState)
	if err != nil {
		return false
	}

	return expected.Equals(received)
}

func (h *AuthHandler) setSessionCookie(w http.ResponseWriter, token string, expiresAt time.Time) {
	http.SetCookie(w, &http.Cookie{
		Name:     constants.CookieSessionName,
		Value:    token,
		Expires:  expiresAt,
		HttpOnly: constants.CookieHttpOnly,
		Secure:   constants.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	})
}

func (h *AuthHandler) clearSessionCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     constants.CookieSessionName,
		Value:    "",
		MaxAge:   -1,
		HttpOnly: constants.CookieHttpOnly,
		Secure:   constants.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	})
}

func (h *AuthHandler) clearStateCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:   constants.CookieStateName,
		Value:  "",
		MaxAge: -1,
		Path:   "/",
	})
}
