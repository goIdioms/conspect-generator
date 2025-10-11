import { Input, TextArea, Card } from '../ui';

interface SettingsProps {
  pages: number;
  setPages: (pages: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export default function Settings({ pages, setPages, notes, setNotes }: SettingsProps) {

  return (
    <Card
      variant="elevated"
      className="
        max-w-md w-full min-h-[450px] p-8
        relative overflow-hidden
        bg-gradient-to-br from-green-900/10 via-green-800/5 to-transparent
        backdrop-blur-xl
        border border-green-800/30
        animate-[slideUp_0.5s_ease-out]
        flex flex-col
        group
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-600/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-green-800/30">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-light text-green-300 tracking-wide">
            Параметры
          </h2>
        </div>

        <div className="space-y-6 flex-1">
          <div className="group/item">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-500/20 rounded-lg">
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <label className="text-sm font-light text-green-200">
                Количество страниц
              </label>
            </div>
            <Input
              type="number"
              min="1"
              max="50"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              placeholder="Введите количество страниц"
              className="group-hover/item:border-green-500/50 transition-all duration-300"
            />
            <p className="mt-2 text-xs text-green-300/70 font-light">
              Рекомендуется: 1-10 страниц
            </p>
          </div>

          <div className="group/item">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-500/20 rounded-lg">
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <label className="text-sm font-light text-green-200">
                Особые примечания
              </label>
            </div>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="На что обратить внимание при обработке..."
              className="group-hover/item:border-green-500/50 transition-all duration-300"
            />
            <p className="mt-2 text-xs text-green-300/70 font-light">
              Укажите ключевые моменты для анализа
            </p>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-green-500/10 backdrop-blur-sm border border-green-500/30">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-green-500/20 rounded-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-xs text-green-200 font-light leading-relaxed">
                Параметры помогут создать более точный и структурированный конспект
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}