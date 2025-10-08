interface UploadButtonProps {
  uploading: boolean;
  onClick: () => void;
}

export default function UploadButton({ uploading, onClick }: UploadButtonProps) {
  return (
    <button
      onClick={onClick}
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
  );
}
