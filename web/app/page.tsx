'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [pdfData, setPdfData] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      setUploadStatus('');
      setPdfData('');
      setProgress(0);
      setCurrentStep('');
    } else {
      alert('Пожалуйста, выберите аудио файл');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setCurrentStep('Подготовка файла...');
    setUploadStatus('');

    try {
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentStep('Отправка на сервер...');
      setProgress(20);

      const formData = new FormData();
      formData.append('audio', file);

      setCurrentStep('Обработка аудио...');
      setProgress(30);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setCurrentStep('Транскрипция аудио... (это может занять несколько минут)');
        setProgress(50);

        setCurrentStep('Суммаризация текста...');
        setProgress(70);

        setCurrentStep('Создание PDF...');
        setProgress(90);

        const result = await response.json();

        setCurrentStep('Завершение...');
        setProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));

        setUploadStatus(`Успешно обработано: ${result.filename}`);
        setPdfData(result.pdfData || '');
        setCurrentStep('');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }));
        setCurrentStep('');
        setProgress(0);
        setUploadStatus(`Ошибка: ${errorData.error || 'Ошибка при обработке'}`);

        if (errorData.error && errorData.error.includes('Бэкенд недоступен')) {
          setUploadStatus(`Ошибка: Бэкенд недоступен. Запустите Go сервер командой: make run-server`);
        }
      }
    } catch (error) {
      setCurrentStep('');
      setProgress(0);
      setUploadStatus('Ошибка при загрузке');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      setUploadStatus('');
      setPdfData('');
      setProgress(0);
      setCurrentStep('');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const downloadPDF = () => {
    if (!pdfData) return;

    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfData}`;
    link.download = 'notes.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Audio → PDF
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Транскрипция и суммаризация в один клик
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative overflow-hidden rounded-2xl border-2 border-dashed p-12
            transition-all duration-300 cursor-pointer group
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-[1.02]'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }
            animate-[slideUp_0.6s_ease-out_0.2s_both]
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {file ? (
            <div className="text-center space-y-3 animate-[fadeIn_0.4s_ease-out]">
              <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Перетащите файл или нажмите для выбора
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  MP3, WAV, OGG, M4A
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`
              mt-6 w-full py-4 px-6 rounded-xl font-medium text-white
              transition-all duration-300 transform
              ${uploading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
              }
              animate-[slideUp_0.6s_ease-out_0.3s_both]
            `}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Обработка...
              </span>
            ) : (
              'Загрузить и обработать'
            )}
          </button>
        )}

        {/* Progress */}
        {uploading && (
          <div className="mt-6 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-[slideUp_0.4s_ease-out]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentStep}</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
            </div>

            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
              Подготовка → Транскрипция → Суммаризация → PDF
            </p>
          </div>
        )}

        {/* Status Message */}
        {uploadStatus && (
          <div className={`
            mt-6 p-4 rounded-xl text-center font-medium
            animate-[slideUp_0.4s_ease-out]
            ${uploadStatus.includes('Ошибка')
              ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
              : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900'
            }
          `}>
            {uploadStatus}
          </div>
        )}

        {/* Download PDF */}
        {pdfData && (
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
              onClick={downloadPDF}
              className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Скачать PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}