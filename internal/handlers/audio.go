package handlers

import (
	"io"
	"net/http"
	"os"

	c "github.com/goIdioms/conspect-generator/internal/constants"
	"github.com/goIdioms/conspect-generator/internal/services"
	"github.com/goIdioms/conspect-generator/internal/validators"
	"github.com/sirupsen/logrus"
)

type AudioHandler struct {
	pdfService           *services.PDFService
	transcriptionService *services.TranscriptionService
	logger               *logrus.Logger
}

func NewAudioHandler(logger *logrus.Logger) *AudioHandler {
	return &AudioHandler{
		pdfService:           services.NewPDFService(),
		transcriptionService: services.NewTranscriptionService(),
		logger:               logger,
	}
}

func (h *AudioHandler) Handle(w http.ResponseWriter, r *http.Request) {
	file, header, err := r.FormFile(c.FormFieldFile)
	if err != nil {
		h.logger.Warnf("Failed to get file: %v", err)
		http.Error(w, "Файл не найден в запросе", http.StatusBadRequest)
		return
	}
	defer file.Close()

	if err := validators.ValidateAudioFile(file, header); err != nil {
		h.logger.Warnf("File validation failed: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	pages := r.FormValue(c.FormFieldPages)
	notes := r.FormValue(c.FormFieldNotes)

	if err := validators.ValidateRequestParams(pages, notes); err != nil {
		h.logger.Warnf("Params validation failed: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	h.logger.Infof("Processing audio: file=%s, size=%d, pages=%s", header.Filename, header.Size, pages)

	tmpFile, err := os.CreateTemp("", c.TempFilePattern)
	if err != nil {
		http.Error(w, "failed to create temp file", http.StatusInternalServerError)
		return
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()

	if _, err := io.Copy(tmpFile, file); err != nil {
		http.Error(w, "failed to save uploaded file", http.StatusInternalServerError)
		return
	}

	summary, err := h.transcriptionService.SummarizeAudio(r.Context(), tmpFile.Name(), pages, notes)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	pdfBytes, err := h.pdfService.CreatePDF(summary)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set(c.HeaderContentType, c.ContentTypePDF)
	w.Header().Set(c.HeaderContentDisposition, c.AttachmentPrefix+"; "+header.Filename+"="+c.OutputPDFFileName)
	w.Write(pdfBytes)
}
