interface StatusMessageProps {
  message: string;
}

export default function StatusMessage({ message }: StatusMessageProps) {
  const isError = message.includes('Ошибка');

  return (
    <div className={`
      mt-6 p-4 rounded-xl text-center font-medium
      animate-[slideUp_0.4s_ease-out]
      ${isError
        ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
        : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900'
      }
    `}>
      {message}
    </div>
  );
}
