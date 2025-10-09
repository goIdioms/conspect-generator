package validators

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
)

const (
	MaxFileSize      = 100 * 1024 * 1024 // 100MB
	MaxAudioDuration = 2 * 60 * 60       // 2 часа
)

var AllowedMimeTypes = map[string]bool{
	"audio/mpeg":               true,
	"audio/mp3":                true,
	"audio/wav":                true,
	"audio/x-wav":              true,
	"audio/wave":               true,
	"audio/ogg":                true,
	"audio/x-m4a":              true,
	"audio/mp4":                true,
	"audio/webm":               true,
	"video/webm":               true,
	"application/octet-stream": true,
}

type FileValidationError struct {
	Field   string
	Message string
}

func (e *FileValidationError) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

func ValidateAudioFile(file multipart.File, header *multipart.FileHeader) error {
	if header.Size > MaxFileSize {
		return &FileValidationError{
			Field:   "file",
			Message: fmt.Sprintf("Файл слишком большой. Максимум: %dMB", MaxFileSize/(1024*1024)),
		}
	}

	if header.Size == 0 {
		return &FileValidationError{
			Field:   "file",
			Message: "Файл пустой",
		}
	}

	if !AllowedMimeTypes[header.Header.Get("Content-Type")] {
		return &FileValidationError{
			Field:   "file",
			Message: fmt.Sprintf("Неподдерживаемый тип файла: %s. Разрешены только аудио файлы", header.Header.Get("Content-Type")),
		}
	}

	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return &FileValidationError{
			Field:   "file",
			Message: "Не удалось прочитать файл",
		}
	}

	if _, err := file.Seek(0, 0); err != nil {
		return &FileValidationError{
			Field:   "file",
			Message: "Ошибка обработки файла",
		}
	}

	contentType := http.DetectContentType(buffer[:n])
	if !strings.HasPrefix(contentType, "audio/") &&
		!strings.HasPrefix(contentType, "video/") &&
		contentType != "application/octet-stream" {
		return &FileValidationError{
			Field:   "file",
			Message: fmt.Sprintf("Файл не является аудио. Обнаружен тип: %s", contentType),
		}
	}

	filename := strings.ToLower(header.Filename)
	allowedExtensions := []string{".mp3", ".wav", ".ogg", ".m4a", ".mp4", ".webm", ".oga"}
	hasValidExtension := false
	for _, ext := range allowedExtensions {
		if strings.HasSuffix(filename, ext) {
			hasValidExtension = true
			break
		}
	}

	if !hasValidExtension {
		return &FileValidationError{
			Field:   "file",
			Message: fmt.Sprintf("Неподдерживаемое расширение файла. Разрешены: %v", allowedExtensions),
		}
	}

	return nil
}

func ValidateRequestParams(pages, notes string) error {
	if pages != "" {
		var pagesNum int
		if _, err := fmt.Sscanf(pages, "%d", &pagesNum); err != nil {
			return &FileValidationError{
				Field:   "pages",
				Message: "pages должен быть числом",
			}
		}
		if pagesNum < 1 || pagesNum > 50 {
			return &FileValidationError{
				Field:   "pages",
				Message: "pages должен быть от 1 до 50",
			}
		}
	}

	if len(notes) > 1000 {
		return &FileValidationError{
			Field:   "notes",
			Message: "notes слишком длинный (максимум 1000 символов)",
		}
	}

	return nil
}
