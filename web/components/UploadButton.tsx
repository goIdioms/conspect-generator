import { Button } from '@/components/ui/button';

interface UploadButtonProps {
  uploading: boolean;
  onClick: () => void;
}

export default function UploadButton({ uploading, onClick }: UploadButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={uploading}
      size="lg"
      className="mt-8 w-full font-bold text-lg py-6 shadow-xl hover:shadow-primary/30 transition-all duration-500 relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <span className="relative z-10">
        {uploading ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            Обработка файла...
          </span>
        ) : (
          'Загрузить и обработать'
        )}
      </span>
    </Button>
  );
}
