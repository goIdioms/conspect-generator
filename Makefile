.PHONY: dev-web dev build migrate-up migrate-down migrate-status help

dev-web:
	cd web && npm run dev

dev:
	air

build:
	go build -o bin/server ./cmd/main.go

migrate-up:
	go run ./cmd/migrate/main.go -action=up

migrate-down:
	go run ./cmd/migrate/main.go -action=down -steps=1

migrate-status:
	go run ./cmd/migrate/main.go -action=status

help:
	@echo "Available commands:"
	@echo "  make dev-web       - Start Next.js development server"
	@echo "  make dev           - Start Go development server with air"
	@echo "  make build         - Build Go server"
	@echo "  make migrate-up    - Run all pending migrations"
	@echo "  make migrate-down  - Rollback last migration"
	@echo "  make migrate-status - Show migration status"
