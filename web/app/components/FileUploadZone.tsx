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
        relative overflow-hidden rounded-xl border-2 border-dashed p-8
        max-w-md w-full min-h-[505px]
        flex items-center justify-center
        transition-all duration-500 cursor-pointer group
        backdrop-blur-md
        ${isDragging
          ? 'border-green-500 bg-green-500/10 scale-[1.02] shadow-lg shadow-green-500/20'
          : 'border-green-900/30 bg-green-900/5 hover:border-green-500/50 hover:bg-green-500/5 hover:shadow-xl hover:shadow-green-500/10'
        }
        animate-[slideUp_0.6s_ease-out_0.2s_both]
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={onFileSelect}
        className="hidden"
      />

      {file ? (
        <div className="text-center space-y-4 animate-[fadeIn_0.4s_ease-out] relative z-10">
          <div className="inline-block p-5 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
            <svg className="w-14 h-14 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-lg font-light text-white truncate px-4">
            {file.name}
          </p>
          <p className="text-sm text-green-300 font-light">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      ) : (
        <div className="text-center space-y-5 relative z-10">
          <div className="inline-block p-5 bg-green-900/20 backdrop-blur-sm rounded-2xl border border-green-800/30 group-hover:scale-110 group-hover:border-green-500/50 transition-all duration-500">
            <svg className="w-14 h-14 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-light text-white mb-2 group-hover:text-green-300 transition-colors">
              Перетащите файл или нажмите для выбора
            </p>
            <p className="text-sm text-green-300 font-light">
              MP3, WAV, OGG, M4A
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
