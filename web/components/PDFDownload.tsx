import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PDFDownloadProps {
  pdfData: string;
  onDownload: () => void;
}

export default function PDFDownload({ pdfData, onDownload }: PDFDownloadProps) {
  if (!pdfData) return null;

  return (
    <Card className="mt-8 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
      {/* Success indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-primary"></div>

      <CardHeader>
        <div className="flex items-center gap-6">
          {/* Modern success indicator */}
          <div className="relative">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded"></div>
              </div>
            </div>
            <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl animate-pulse"></div>
          </div>

          <div>
            <CardTitle className="text-2xl font-display font-bold text-foreground mb-2">
              Конспект готов!
            </CardTitle>
            <p className="text-muted-foreground font-light">
              Ваш аудиофайл успешно обработан и преобразован в структурированный PDF
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Button
          onClick={onDownload}
          size="lg"
          className="w-full font-bold text-lg py-6 shadow-xl hover:shadow-primary/30 transition-all duration-500 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span>Скачать PDF</span>
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 border-2 border-current rounded border-dashed group-hover:rotate-180 transition-transform duration-700"></div>
              <div className="absolute inset-2 bg-current rounded"></div>
            </div>
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}