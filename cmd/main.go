package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	openai "github.com/sashabaranov/go-openai"
)

func main() {
	_ = godotenv.Load()
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Get started"))
	})

	r.Post("/audio", handleAudio)

	http.ListenAndServe(os.Getenv("HTTP_ADDR"), r)
}

func handleAudio(w http.ResponseWriter, r *http.Request) {
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	tmpFile, err := os.CreateTemp("", "audio-*.mp3")
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

	summary, err := summarizeAudio(r.Context(), tmpFile.Name())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	pdfBytes, err := createPDF(summary)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=notes.pdf")
	w.Write(pdfBytes)
}

func summarizeAudio(ctx context.Context, filePath string) (string, error) {
	resp, err := openai.NewClient(os.Getenv("OPENAI_API_KEY")).CreateTranscription(ctx, openai.AudioRequest{
		Model:    openai.Whisper1,
		FilePath: filePath,
	})
	if err != nil {
		return "", err
	}
	text := resp.Text

	summaryResp, err := openai.NewClient(os.Getenv("OPENAI_API_KEY")).CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: openai.GPT4oMini,
		Messages: []openai.ChatCompletionMessage{
			{Role: openai.ChatMessageRoleUser, Content: "Суммируй текст: " + text},
		},
	})
	if err != nil {
		return "", err
	}
	if len(summaryResp.Choices) == 0 {
		return "", nil
	}
	return summaryResp.Choices[0].Message.Content, nil
}

func createPDF(textContent string) ([]byte, error) {
	log.Println("Creating PDF...")

	html := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            color: #333;
        }
        p {
            margin-bottom: 12px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <p>%s</p>
</body>
</html>`, strings.ReplaceAll(textContent, "\n", "<br>"))

	tmpFile, err := os.CreateTemp("", "pdf-*.html")
	if err != nil {
		log.Printf("Failed to create temp file: %v", err)
		return nil, err
	}
	defer os.Remove(tmpFile.Name())

	if _, err := tmpFile.WriteString(html); err != nil {
		log.Printf("Failed to write HTML: %v", err)
		return nil, err
	}
	tmpFile.Close()

	log.Printf("HTML file created: %s", tmpFile.Name())

	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	var pdfBuf []byte

	log.Println("Starting Chrome to generate PDF...")
	if err := chromedp.Run(ctx,
		chromedp.Navigate("file://"+tmpFile.Name()),
		chromedp.WaitReady("body"),
		chromedp.ActionFunc(func(ctx context.Context) error {
			log.Println("Printing to PDF...")
			var err error
			pdfBuf, _, err = page.PrintToPDF().WithPrintBackground(true).Do(ctx)
			if err != nil {
				log.Printf("PrintToPDF error: %v", err)
			}
			return err
		}),
	); err != nil {
		log.Printf("ChromeDP error: %v", err)
		return nil, fmt.Errorf("chrome error: %w", err)
	}

	log.Printf("PDF generated successfully, size: %d bytes", len(pdfBuf))
	return pdfBuf, nil
}
