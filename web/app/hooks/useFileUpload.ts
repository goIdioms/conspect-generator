import { useState, useRef } from 'react';

export function useFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [pdfData, setPdfData] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [pages, setPages] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      formData.append('pages', pages.toString());
      formData.append('notes', notes);

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

  return {
    file,
    uploading,
    uploadStatus,
    pdfData,
    progress,
    currentStep,
    isDragging,
    pages,
    setPages,
    notes,
    setNotes,
    fileInputRef,
    handleFileSelect,
    handleUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    downloadPDF,
  };
}
