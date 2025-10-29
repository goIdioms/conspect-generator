package user

import (
	"context"
	"errors"
	"fmt"

	domainUser "github.com/goIdioms/conspect-generator/internal/domain/user"
	"github.com/goIdioms/conspect-generator/internal/services"
	"github.com/sirupsen/logrus"
)

type Service struct {
	userRepo domainUser.Repository
	logger   *logrus.Logger
}

func NewService(userRepo domainUser.Repository, logger *logrus.Logger) *Service {
	return &Service{
		userRepo: userRepo,
		logger:   logger,
	}
}

func (s *Service) CreateOrUpdateUser(ctx context.Context, googleUser *services.GoogleUser) (*domainUser.User, error) {
	googleID, err := domainUser.NewGoogleID(googleUser.ID)
	if err != nil {
		return nil, fmt.Errorf("invalid google ID: %w", err)
	}

	email, err := domainUser.NewEmail(googleUser.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid email: %w", err)
	}

	existingUser, err := s.userRepo.FindByGoogleID(ctx, googleID)

	if err != nil {
		if errors.Is(err, domainUser.ErrUserNotFound) {
			newUser := domainUser.NewUser(
				googleID,
				email,
				googleUser.Name,
				googleUser.Picture,
				googleUser.VerifiedEmail,
			)

			if err := s.userRepo.Create(ctx, newUser); err != nil {
				return nil, fmt.Errorf("failed to create user: %w", err)
			}

			s.logger.Infof("Created new user: %s (%s)", newUser.Name, newUser.Email.String())
			return newUser, nil
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	existingUser.UpdateProfile(email, googleUser.Name, googleUser.Picture, googleUser.VerifiedEmail)

	if err := s.userRepo.Update(ctx, existingUser); err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	s.logger.Infof("Updated user: %s (%s)", existingUser.Name, existingUser.Email.String())
	return existingUser, nil
}

func (s *Service) GetUserByID(ctx context.Context, id int) (*domainUser.User, error) {
	user, err := s.userRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, domainUser.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user by ID: %w", err)
	}
	return user, nil
}

func (s *Service) GetUserByGoogleID(ctx context.Context, googleID string) (*domainUser.User, error) {
	gid, err := domainUser.NewGoogleID(googleID)
	if err != nil {
		return nil, fmt.Errorf("invalid google ID: %w", err)
	}

	user, err := s.userRepo.FindByGoogleID(ctx, gid)
	if err != nil {
		if errors.Is(err, domainUser.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user by Google ID: %w", err)
	}
	return user, nil
}

func (s *Service) GetUserByEmail(ctx context.Context, email string) (*domainUser.User, error) {
	e, err := domainUser.NewEmail(email)
	if err != nil {
		return nil, fmt.Errorf("invalid email: %w", err)
	}

	user, err := s.userRepo.FindByEmail(ctx, e)
	if err != nil {
		if errors.Is(err, domainUser.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	return user, nil
}

func (s *Service) DeleteUser(ctx context.Context, id int) error {
	if err := s.userRepo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}
	s.logger.Infof("Deleted user with ID: %d", id)
	return nil
}
