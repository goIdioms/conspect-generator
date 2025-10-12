import { Badge } from '@/components/ui/badge';

interface StatusMessageProps {
  message: string;
}

export default function StatusMessage({ message }: StatusMessageProps) {
  const isError = message.includes('Ошибка');

  return (
    <div className={`
      mt-8 p-6 rounded-xl text-center relative overflow-hidden
      ${isError
        ? 'bg-destructive/10 border border-destructive/30'
        : 'bg-primary/10 border border-primary/30'
      }
    `}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"></div>

      <div className="relative z-10">
        <Badge variant={isError ? "destructive" : "default"} className="mb-4">
          {isError ? 'Ошибка' : 'Статус'}
        </Badge>

        <p className={`font-medium text-lg ${
          isError ? 'text-destructive' : 'text-foreground'
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
}