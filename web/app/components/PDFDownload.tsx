import Button from '../ui/Button';
import Card from '../ui/Card';

interface PDFDownloadProps {
  pdfData: string;
  onDownload: () => void;
}

export default function PDFDownload({ pdfData, onDownload }: PDFDownloadProps) {
  if (!pdfData) return null;

  return (
    <Card className="mt-6 p-6 bg-gradient-to-br from-green-500/10 via-green-600/10 to-emerald-500/10 border border-green-500/30 backdrop-blur-xl animate-[slideUp_0.4s_ease-out] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/30">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-light text-green-300">
            PDF готов!
          </h3>
        </div>
        <p className="text-sm text-green-200 mb-5 font-light">
          Аудио успешно обработано и конвертировано в PDF
        </p>
        <Button
          onClick={onDownload}
          variant="success"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Скачать PDF
        </Button>
      </div>
    </Card>
  );
}
