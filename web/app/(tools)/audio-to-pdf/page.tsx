'use client';

import { useFileUpload } from '../../hooks/useFileUpload';
import Navbar from '../../components/Navbar';
import FileUploadZone from '../../components/FileUploadZone';
import UploadButton from '../../components/UploadButton';
import ProgressBar from '../../components/ProgressBar';
import StatusMessage from '../../components/StatusMessage';
import PDFDownload from '../../components/PDFDownload';
import Settings from '../../components/Settings';
import { Box } from '../../ui';

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
        <div className="text-center mb-12 animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-5xl md:text-6xl font-display font-light mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-green-100 to-white tracking-wide">
            Audio → PDF
          </h1>
          <p className="text-green-200 text-lg font-light">
            Транскрипция и суммаризация в один клик
          </p>
        </div>

        <Box className='w-full justify-center items-start h-full'>
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
        </Box>

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
