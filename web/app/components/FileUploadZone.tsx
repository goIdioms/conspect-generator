import { RefObject } from 'react';

interface FileUploadZoneProps {
  file: File | null;
  isDragging: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadZone({
  file,
  isDragging,
  fileInputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileSelect,
}: FileUploadZoneProps) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
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
        onChange={onFileSelect}
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
  );
}
