package services

import (
	"context"
	"fmt"
	"os"

	"github.com/sashabaranov/go-openai"
)

type TranscriptionService struct {
	apiKey string
	client *openai.Client
}

func NewTranscriptionService() *TranscriptionService {
	return &TranscriptionService{
		apiKey: os.Getenv("OPENAI_API_KEY"),
		client: openai.NewClient(os.Getenv("OPENAI_API_KEY")),
	}
}

func (s *TranscriptionService) SummarizeAudio(ctx context.Context, filePath, pages, notes string) (string, error) {
	resp, err := s.client.CreateTranscription(ctx, openai.AudioRequest{
		Model:    openai.Whisper1,
		FilePath: filePath,
	})
	if err != nil {
		return "", err
	}
	text := resp.Text

	prompt := s.BuildSummaryPrompt(text, pages, notes)

	summaryResp, err := s.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: openai.GPT4oMini,
		Messages: []openai.ChatCompletionMessage{
			{Role: openai.ChatMessageRoleUser, Content: prompt},
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

func (s *TranscriptionService) BuildSummaryPrompt(text, pages, notes string) string {
	prompt := `Создай подробный конспект в виде связного текста, как будто его пишет человек от руки в тетрадь.
				ВАЖНЫЕ ТРЕБОВАНИЯ:
				- Пиши ТОЛЬКО связным текстом, БЕЗ ЛЮБОЙ нумерации (ни цифровой, ни маркированной)
				- НЕ используй списки, маркеры (•, *, -, ⦿), цифры для перечисления
				- Структурируй мысли абзацами, а не списками
				- Пиши естественным разговорным языком, как в личных заметках
				- Избегай формальных фраз типа "в заключение", "таким образом"
				- Используй простые переходы между мыслями
				- Текст должен выглядеть как рукописные заметки студента`

	if pages != "" && pages != "0" {
		prompt += fmt.Sprintf("Примерный объем: %s страниц рукописного текста.\n", pages)
	}

	if notes != "" {
		prompt += fmt.Sprintf("Особенности: %s\n", notes)
	}

	prompt += "\n---\nТранскрипция:\n" + text

	return prompt
}
