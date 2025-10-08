'use client';

import { useFileUpload } from './hooks/useFileUpload';
import Header from './components/Header';
import FileUploadZone from './components/FileUploadZone';
import UploadButton from './components/UploadButton';
import ProgressBar from './components/ProgressBar';
import StatusMessage from './components/StatusMessage';
import PDFDownload from './components/PDFDownload';

export default function Home() {
  const {
    file,
    uploading,
    uploadStatus,
    pdfData,
    progress,
    currentStep,
    isDragging,
    fileInputRef,
    handleFileSelect,
    handleUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    downloadPDF,
  } = useFileUpload();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-2xl">
        <Header />

        <FileUploadZone
          file={file}
          isDragging={isDragging}
          fileInputRef={fileInputRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFileSelect={handleFileSelect}
        />

        {file && (
          <UploadButton uploading={uploading} onClick={handleUpload} />
        )}

        {uploading && (
          <ProgressBar progress={progress} currentStep={currentStep} />
        )}

        {uploadStatus && (
          <StatusMessage message={uploadStatus} />
        )}

        <PDFDownload pdfData={pdfData} onDownload={downloadPDF} />
      </div>
    </div>
  );
}
