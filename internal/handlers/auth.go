package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/goIdioms/conspect-generator/internal/database"
	"github.com/goIdioms/conspect-generator/internal/services"
	"github.com/sirupsen/logrus"
)

type AuthHandler struct {
	authService *services.AuthService
	database    *database.Database
	logger      *logrus.Logger
	frontendURL string
}

func NewAuthHandler(authService *services.AuthService, db *database.Database, logger *logrus.Logger, frontendURL string) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		database:    db,
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

	// Сохраняем или обновляем пользователя в базе данных
	dbUser, err := h.database.CreateOrUpdateUser(userInfo)
	if err != nil {
		h.logger.Errorf("Failed to save user to database: %v", err)
		h.redirectToFrontendWithError(w, r, "Failed to save user data")
		return
	}

	// Создаем сессию пользователя
	sessionToken := generateSessionToken()
	expiresAt := time.Now().Add(24 * time.Hour) // Сессия на 24 часа

	_, err = h.database.CreateSession(dbUser.ID, sessionToken, expiresAt)
	if err != nil {
		h.logger.Errorf("Failed to create user session: %v", err)
		h.redirectToFrontendWithError(w, r, "Failed to create session")
		return
	}

	// Устанавливаем куки с токеном сессии
	h.setSessionCookie(w, sessionToken, expiresAt)
	h.clearStateCookie(w)
	h.redirectToFrontendWithUser(w, r, userInfo, sessionToken)
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

func (h *AuthHandler) setSessionCookie(w http.ResponseWriter, token string, expiresAt time.Time) {
	cookie := &http.Cookie{
		Name:     constants.CookieSessionName,
		Value:    token,
		Expires:  expiresAt,
		HttpOnly: constants.CookieHttpOnly,
		Secure:   constants.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	}
	http.SetCookie(w, cookie)
}

func (h *AuthHandler) clearSessionCookie(w http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:     constants.CookieSessionName,
		Value:    "",
		MaxAge:   -1,
		HttpOnly: constants.CookieHttpOnly,
		Secure:   constants.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	}
	http.SetCookie(w, cookie)
}

func generateState() string {
	b := make([]byte, constants.StateLength)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

func generateSessionToken() string {
	b := make([]byte, 32) // 32 байта для токена сессии
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

// GetCurrentUser возвращает информацию о текущем пользователе по куки сессии
func (h *AuthHandler) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	sessionCookie, err := r.Cookie(constants.CookieSessionName)
	if err != nil {
		http.Error(w, "Session cookie not found", http.StatusUnauthorized)
		return
	}

	session, err := h.database.GetSessionByToken(sessionCookie.Value)
	if err != nil {
		h.logger.Errorf("Failed to get session: %v", err)
		http.Error(w, "Invalid session", http.StatusUnauthorized)
		return
	}

	user, err := h.database.GetUserByID(session.UserID)
	if err != nil {
		h.logger.Errorf("Failed to get user: %v", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Logout завершает сессию пользователя
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	sessionCookie, err := r.Cookie(constants.CookieSessionName)
	if err != nil {
		http.Error(w, "Session cookie not found", http.StatusBadRequest)
		return
	}

	// Удаляем сессию из базы данных
	if err := h.database.DeleteSession(sessionCookie.Value); err != nil {
		h.logger.Errorf("Failed to delete session: %v", err)
		http.Error(w, "Failed to logout", http.StatusInternalServerError)
		return
	}

	// Удаляем куки
	h.clearSessionCookie(w)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logged out successfully"))
}
