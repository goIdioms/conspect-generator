import { RefObject } from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card
      className={`
        max-w-md w-full min-h-[505px] cursor-pointer group transition-all duration-700 relative overflow-hidden
        ${isDragging
          ? 'border-primary bg-primary/10 scale-105 shadow-2xl shadow-primary/20'
          : 'border-dashed border-border/50 hover:border-primary/50 hover:bg-muted/30'
        }
      `}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={onFileSelect}
        className="hidden"
      />

      <CardContent className="h-full flex items-center justify-center relative z-10">
        {file ? (
          <div className="text-center space-y-8">
            {/* File representation with modern geometric design */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-12"></div>
                <div className="absolute inset-2 bg-primary/40 rounded-2xl -rotate-6"></div>
                <div className="absolute inset-4 bg-primary rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary-foreground rounded-lg"></div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl"></div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-display font-bold text-foreground">
                Файл загружен
              </h3>
              <p className="text-lg font-medium text-foreground/80 truncate px-4">
                {file.name}
              </p>
              <p className="text-sm text-muted-foreground font-light">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            {/* Upload area with modern design */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-muted/50 rounded-3xl border-2 border-dashed border-border"></div>
                <div className="absolute inset-8 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/30 rounded-lg group-hover:bg-primary/50 transition-colors duration-500"></div>
                </div>
              </div>
              <div className="absolute -inset-8 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors duration-500">
                Загрузите аудиофайл
              </h3>
              <p className="text-lg text-muted-foreground font-light">
                Перетащите файл сюда или нажмите для выбора
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['MP3', 'WAV', 'OGG', 'M4A'].map((format) => (
                  <span
                    key={format}
                    className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-full border border-border/50"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}