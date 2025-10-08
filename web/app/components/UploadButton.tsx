import Button from '../ui/Button';

interface UploadButtonProps {
  uploading: boolean;
  onClick: () => void;
}

export default function UploadButton({ uploading, onClick }: UploadButtonProps) {
  return (
    <Button
      onClick={onClick}
      loading={uploading}
      variant="primary"
      size="lg"
      className="mt-6 w-full animate-[slideUp_0.6s_ease-out_0.3s_both]"
    >
      {uploading ? 'Обработка...' : 'Загрузить и обработать'}
    </Button>
  );
}
