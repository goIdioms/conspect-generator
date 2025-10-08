interface PDFDownloadProps {
  pdfData: string;
  onDownload: () => void;
}

export default function PDFDownload({ pdfData, onDownload }: PDFDownloadProps) {
  if (!pdfData) return null;

  return (
    <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-900 animate-[slideUp_0.4s_ease-out]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
          PDF готов!
        </h3>
      </div>
      <p className="text-sm text-green-700 dark:text-green-300 mb-4">
        Аудио успешно обработано и конвертировано в PDF
      </p>
      <button
        onClick={onDownload}
        className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Скачать PDF
      </button>
    </div>
  );
}
