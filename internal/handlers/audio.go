package handlers

import (
	"io"
	"net/http"
	"os"

	"github.com/goIdioms/conspect-generator/internal/services"
)


type AudioHandler struct {
	pdfService           *services.PDFService
	transcriptionService *services.TranscriptionService
}

func NewAudioHandler() *AudioHandler {
	return &AudioHandler{
		pdfService:           services.NewPDFService(),
		transcriptionService: services.NewTranscriptionService(),
	}
}

func (h *AudioHandler) Handle(w http.ResponseWriter, r *http.Request) {
	file, _, err := r.FormFile(fileField)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	pages := r.FormValue(pagesField)
	notes := r.FormValue(notesField)

	tmpFile, err := os.CreateTemp("", tempFileName)
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
	w.Header().Set(contentType, applicationPdf)
	w.Header().Set(contentDisposition, attachment+"; "+filename+"="+notesPdf)
	w.Write(pdfBytes)
}
