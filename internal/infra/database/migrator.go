package database

import (
	"database/sql"
	"embed"
	"fmt"
	"sort"
	"strings"

	"github.com/sirupsen/logrus"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

type Migrator struct {
	db     *sql.DB
	logger *logrus.Logger
}

type Migration struct {
	Version int
	Name    string
	UpSQL   string
	DownSQL string
}

func NewMigrator(db *sql.DB, logger *logrus.Logger) *Migrator {
	return &Migrator{
		db:     db,
		logger: logger,
	}
}

func (m *Migrator) createMigrationsTable() error {
	query := `
	CREATE TABLE IF NOT EXISTS schema_migrations (
		version INTEGER PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := m.db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	return nil
}

func (m *Migrator) getAppliedVersions() (map[int]bool, error) {
	applied := make(map[int]bool)

	rows, err := m.db.Query("SELECT version FROM schema_migrations ORDER BY version")
	if err != nil {
		return nil, fmt.Errorf("failed to get applied migrations: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var version int
		if err := rows.Scan(&version); err != nil {
			return nil, fmt.Errorf("failed to scan migration version: %w", err)
		}
		applied[version] = true
	}

	return applied, nil
}

func (m *Migrator) loadMigrations() ([]Migration, error) {
	entries, err := migrationsFS.ReadDir("migrations")
	if err != nil {
		return nil, fmt.Errorf("failed to read migrations directory: %w", err)
	}

	migrationsMap := make(map[int]*Migration)

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		filename := entry.Name()
		if !strings.HasSuffix(filename, ".sql") {
			continue
		}

		var version int
		var name, direction string

		parts := strings.Split(filename, "_")
		if len(parts) < 2 {
			continue
		}

		fmt.Sscanf(parts[0], "%d", &version)

		if strings.Contains(filename, ".up.sql") {
			direction = "up"
			name = strings.TrimSuffix(strings.TrimPrefix(filename, parts[0]+"_"), ".up.sql")
		} else if strings.Contains(filename, ".down.sql") {
			direction = "down"
			name = strings.TrimSuffix(strings.TrimPrefix(filename, parts[0]+"_"), ".down.sql")
		} else {
			continue
		}

		content, err := migrationsFS.ReadFile("migrations/" + filename)
		if err != nil {
			return nil, fmt.Errorf("failed to read migration file %s: %w", filename, err)
		}

		if migrationsMap[version] == nil {
			migrationsMap[version] = &Migration{
				Version: version,
				Name:    name,
			}
		}

		if direction == "up" {
			migrationsMap[version].UpSQL = string(content)
		} else {
			migrationsMap[version].DownSQL = string(content)
		}
	}

	migrations := make([]Migration, 0, len(migrationsMap))
	for _, migration := range migrationsMap {
		migrations = append(migrations, *migration)
	}

	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	return migrations, nil
}

func (m *Migrator) Up() error {
	if err := m.createMigrationsTable(); err != nil {
		return err
	}

	applied, err := m.getAppliedVersions()
	if err != nil {
		return err
	}

	migrations, err := m.loadMigrations()
	if err != nil {
		return err
	}

	for _, migration := range migrations {
		if applied[migration.Version] {
			m.logger.Debugf("Migration %d (%s) already applied, skipping", migration.Version, migration.Name)
			continue
		}

		m.logger.Infof("Applying migration %d: %s", migration.Version, migration.Name)

		tx, err := m.db.Begin()
		if err != nil {
			return fmt.Errorf("failed to begin transaction for migration %d: %w", migration.Version, err)
		}

		if _, err := tx.Exec(migration.UpSQL); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to apply migration %d: %w", migration.Version, err)
		}

		if _, err := tx.Exec("INSERT INTO schema_migrations (version, name) VALUES ($1, $2)",
			migration.Version, migration.Name); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to record migration %d: %w", migration.Version, err)
		}

		if err := tx.Commit(); err != nil {
			return fmt.Errorf("failed to commit migration %d: %w", migration.Version, err)
		}

		m.logger.Infof("Successfully applied migration %d: %s", migration.Version, migration.Name)
	}

	m.logger.Info("All migrations applied successfully")
	return nil
}

func (m *Migrator) Down(steps int) error {
	if err := m.createMigrationsTable(); err != nil {
		return err
	}

	applied, err := m.getAppliedVersions()
	if err != nil {
		return err
	}

	migrations, err := m.loadMigrations()
	if err != nil {
		return err
	}

	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version > migrations[j].Version
	})

	rolledBack := 0
	for _, migration := range migrations {
		if !applied[migration.Version] {
			continue
		}

		if rolledBack >= steps {
			break
		}

		m.logger.Infof("Rolling back migration %d: %s", migration.Version, migration.Name)

		tx, err := m.db.Begin()
		if err != nil {
			return fmt.Errorf("failed to begin transaction for rollback %d: %w", migration.Version, err)
		}

		if _, err := tx.Exec(migration.DownSQL); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to rollback migration %d: %w", migration.Version, err)
		}

		if _, err := tx.Exec("DELETE FROM schema_migrations WHERE version = $1", migration.Version); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to remove migration record %d: %w", migration.Version, err)
		}

		if err := tx.Commit(); err != nil {
			return fmt.Errorf("failed to commit rollback %d: %w", migration.Version, err)
		}

		m.logger.Infof("Successfully rolled back migration %d: %s", migration.Version, migration.Name)
		rolledBack++
	}

	m.logger.Infof("Rolled back %d migration(s)", rolledBack)
	return nil
}

func (m *Migrator) Status() error {
	if err := m.createMigrationsTable(); err != nil {
		return err
	}

	applied, err := m.getAppliedVersions()
	if err != nil {
		return err
	}

	migrations, err := m.loadMigrations()
	if err != nil {
		return err
	}

	m.logger.Info("Migration status:")
	for _, migration := range migrations {
		status := "pending"
		if applied[migration.Version] {
			status = "applied"
		}
		m.logger.Infof("  [%s] %d: %s", status, migration.Version, migration.Name)
	}

	return nil
}
