'use client';

import { useFileUpload } from '@/app/hooks/useFileUpload';
import Navbar from '@/components/Navbar';
import FileUploadZone from '@/components/FileUploadZone';
import UploadButton from '@/components/UploadButton';
import ProgressBar from '@/components/ProgressBar';
import StatusMessage from '@/components/StatusMessage';
import PDFDownload from '@/components/PDFDownload';
import Settings from '@/components/Settings';

export default function AudioToPDF() {
  const {
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
  } = useFileUpload();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <Navbar />
      <div className="flex items-center justify-center px-4 py-24 relative z-10">
        <div>
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-7xl font-display font-black text-foreground tracking-tighter leading-none">
              Audio
            </h1>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-24"></div>
              <span className="text-2xl font-display font-thin text-primary">→</span>
              <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-24"></div>
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-black text-foreground tracking-tighter leading-none mt-4">
              PDF
            </h1>
          </div>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Превратите любую аудиозапись в профессиональный конспект
            <span className="font-semibold text-foreground">за несколько минут</span>
          </p>
        </div>

        <div className='w-full flex justify-center items-start h-full gap-8'>
          <Settings
            pages={pages}
            setPages={setPages}
            notes={notes}
            setNotes={setNotes}
          />
          <FileUploadZone
            file={file}
            isDragging={isDragging}
            fileInputRef={fileInputRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileSelect={handleFileSelect}
          />
        </div>

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
    </div>
  );
}
