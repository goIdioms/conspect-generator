import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsProps {
  pages: number;
  setPages: (pages: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export default function Settings({ pages, setPages, notes, setNotes }: SettingsProps) {
  return (
    <Card className="max-w-md w-full min-h-[450px] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.02)_25%,rgba(34,197,94,0.02)_50%,transparent_50%,transparent_75%,rgba(34,197,94,0.02)_75%)] bg-[length:20px_20px]"></div>

      <CardHeader className="border-b relative z-10">
        <div className="flex items-center gap-4">
          {/* Modern geometric icon */}
          <div className="relative">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center">
              <div className="w-6 h-6 relative">
                <div className="absolute inset-0 bg-primary/30 rounded rotate-45"></div>
                <div className="absolute inset-1 bg-primary/50 rounded rotate-12"></div>
                <div className="absolute inset-2 bg-primary rounded"></div>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold">
            Настройки генерации
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 relative z-10">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground uppercase tracking-wide mb-3 block">
              Объем конспекта
            </label>
            <Input
              type="number"
              min="1"
              max="50"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              placeholder="Количество страниц"
              className="text-lg font-medium"
            />
            <p className="mt-3 text-xs text-muted-foreground font-light">
              Оптимально: <span className="font-semibold text-primary">3-8 страниц</span> для лекции 1 час
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-foreground uppercase tracking-wide">
            Дополнительные инструкции
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Укажите особые требования к конспекту: стиль изложения, акценты, структура..."
            className="min-h-[120px] text-base font-light"
          />
          <p className="text-xs text-muted-foreground font-light">
            Чем подробнее инструкции, тем точнее будет результат
          </p>
        </div>

        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <h4 className="font-display font-semibold text-foreground mb-2">
              Про-совет
            </h4>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Добавьте конкретные вопросы или темы, на которые хотите получить ответы в конспекте
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}