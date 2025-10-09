package services

import (
	"fmt"
	"os"
	"strings"

	"github.com/signintech/gopdf"
)

type PDFService struct {
	pdf    *gopdf.GoPdf
	params PDFParams
}

type PDFParams struct {
	marginLeft  float64
	marginTop   float64
	marginRight float64
	pageWidth   float64
	maxWidth    float64

	fontSize float64
	fontName string
}

func NewPDFService() *PDFService {
	return &PDFService{
		pdf: &gopdf.GoPdf{},
		params: PDFParams{
			marginLeft:  defaultMarginLeft,
			marginTop:   defaultMarginTop,
			marginRight: defaultMarginRight,
			pageWidth:   defaultPageWidth,
			maxWidth:    defaultMaxWidth,
			fontSize:    defaultFontSize,
			fontName:    handwrittenFont,
		},
	}
}

func (s *PDFService) CreatePDF(textContent string) ([]byte, error) {
	textContent = s.CleanTextForPDF(textContent)

	s.pdf.Start(gopdf.Config{PageSize: *gopdf.PageSizeA4})
	s.pdf.AddPage()

	if _, err := os.Stat(handwrittenFontPath); err == nil {
		s.params.fontName = handwrittenFont
		if err := s.pdf.AddTTFFont(s.params.fontName, handwrittenFontPath); err != nil {
			return nil, fmt.Errorf("failed to add font: %w", err)
		}
	}

	if err := s.pdf.SetFont(s.params.fontName, "", s.params.fontSize); err != nil {
		return nil, fmt.Errorf("failed to set font: %w", err)
	}

	s.pdf.SetX(s.params.marginLeft)
	s.pdf.SetY(s.params.marginTop)

	s.FormatTextForPDF(textContent)

	if pdfBytes, err := s.SavePDF(); err != nil {
		return nil, fmt.Errorf("failed to save PDF: %w", err)
	} else {
		return pdfBytes, nil
	}
}

func (s *PDFService) CleanTextForPDF(text string) string {
	result := text

	result = strings.ReplaceAll(result, "**", "")
	result = strings.ReplaceAll(result, "*", "")
	result = strings.ReplaceAll(result, "_", "")
	result = strings.ReplaceAll(result, "###", "")
	result = strings.ReplaceAll(result, "##", "")
	result = strings.ReplaceAll(result, "#", "")
	result = strings.ReplaceAll(result, "`", "")
	result = strings.ReplaceAll(result, "~", "")
	result = strings.ReplaceAll(result, "- ", "")
	result = strings.ReplaceAll(result, "• ", "")
	result = strings.ReplaceAll(result, "* ", "")
	result = strings.ReplaceAll(result, "+ ", "")

	lines := strings.Split(result, "\n")
	for i, line := range lines {
		trimmed := strings.TrimSpace(line)
		for len(trimmed) > 0 && trimmed[0] >= '0' && trimmed[0] <= '9' {
			j := 0
			for j < len(trimmed) && (trimmed[j] >= '0' && trimmed[j] <= '9' || trimmed[j] == '.') {
				j++
			}
			if j > 0 && j < len(trimmed) {
				trimmed = strings.TrimSpace(trimmed[j:])
			} else {
				break
			}
		}
		lines[i] = trimmed
	}
	result = strings.Join(lines, "\n")

	for strings.Contains(result, "  ") {
		result = strings.ReplaceAll(result, "  ", " ")
	}
	for strings.Contains(result, "\n\n\n") {
		result = strings.ReplaceAll(result, "\n\n\n", "\n\n")
	}

	return result
}

func (s *PDFService) FormatTextForPDF(textContent string) {
	paragraphs := strings.Split(textContent, "\n")

	for _, paragraph := range paragraphs {
		if paragraph == "" {
			s.pdf.SetY(s.pdf.GetY() + 10)
			continue
		}

		words := strings.Fields(paragraph)
		currentLine := ""

		for _, word := range words {
			testLine := currentLine
			if testLine != "" {
				testLine += " "
			}
			testLine += word

			width, _ := s.pdf.MeasureTextWidth(testLine)

			if width > s.params.maxWidth {
				if currentLine != "" {
					s.pdf.Cell(nil, currentLine)
					s.pdf.Br(20)

					if s.pdf.GetY() > 800 {
						s.pdf.AddPage()
						s.pdf.SetY(s.params.marginTop)
					}
				}
				currentLine = word
			} else {
				currentLine = testLine
			}
		}

		if currentLine != "" {
			s.pdf.Cell(nil, currentLine)
			s.pdf.Br(20)

			if s.pdf.GetY() > 800 {
				s.pdf.AddPage()
				s.pdf.SetY(s.params.marginTop)
			}
		}
	}
}

func (s *PDFService) SavePDF() ([]byte, error) {
	tmpFile, err := os.CreateTemp("", "pdf-*.pdf")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()

	if err := s.pdf.WritePdf(tmpFile.Name()); err != nil {
		return nil, fmt.Errorf("failed to write PDF: %w", err)
	}

	pdfBytes, err := os.ReadFile(tmpFile.Name())
	if err != nil {
		return nil, fmt.Errorf("failed to read PDF: %w", err)
	}

	return pdfBytes, nil
}
