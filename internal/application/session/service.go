package session

import (
	"context"
	"errors"
	"fmt"
	"time"

	domainSession "github.com/goIdioms/conspect-generator/internal/domain/session"
	"github.com/sirupsen/logrus"
)

type Service struct {
	sessionRepo domainSession.Repository
	logger      *logrus.Logger
}

func NewService(sessionRepo domainSession.Repository, logger *logrus.Logger) *Service {
	return &Service{
		sessionRepo: sessionRepo,
		logger:      logger,
	}
}

func (s *Service) CreateSession(ctx context.Context, userID int, duration time.Duration) (*domainSession.Session, error) {
	token := domainSession.GenerateToken()
	session := domainSession.NewSession(userID, token, duration)

	if err := s.sessionRepo.Create(ctx, session); err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	s.logger.Infof("Created session for user %d", userID)
	return session, nil
}

func (s *Service) ValidateSession(ctx context.Context, tokenStr string) (*domainSession.Session, error) {
	token, err := domainSession.NewToken(tokenStr)
	if err != nil {
		return nil, err
	}

	session, err := s.sessionRepo.FindByToken(ctx, token)
	if err != nil {
		if errors.Is(err, domainSession.ErrSessionNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to find session: %w", err)
	}

	if session.IsExpired() {
		return nil, domainSession.ErrSessionExpired
	}

	return session, nil
}

func (s *Service) DeleteSession(ctx context.Context, tokenStr string) error {
	token, err := domainSession.NewToken(tokenStr)
	if err != nil {
		return err
	}

	if err := s.sessionRepo.Delete(ctx, token); err != nil {
		return fmt.Errorf("failed to delete session: %w", err)
	}

	s.logger.Info("Deleted session")
	return nil
}

func (s *Service) DeleteUserSessions(ctx context.Context, userID int) error {
	if err := s.sessionRepo.DeleteByUserID(ctx, userID); err != nil {
		return fmt.Errorf("failed to delete user sessions: %w", err)
	}

	s.logger.Infof("Deleted all sessions for user %d", userID)
	return nil
}

func (s *Service) CleanExpiredSessions(ctx context.Context) error {
	count, err := s.sessionRepo.CleanExpired(ctx)
	if err != nil {
		return fmt.Errorf("failed to clean expired sessions: %w", err)
	}

	if count > 0 {
		s.logger.Infof("Cleaned %d expired sessions", count)
	}
	return nil
}

func (s *Service) GetUserSessions(ctx context.Context, userID int) ([]*domainSession.Session, error) {
	sessions, err := s.sessionRepo.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user sessions: %w", err)
	}
	return sessions, nil
}
