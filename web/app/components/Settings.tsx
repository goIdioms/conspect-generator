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
        max-w-md w-full min-h-[450px] p-6
        bg-gradient-to-br from-white to-slate-50
        dark:from-slate-900 dark:to-slate-800
        border border-slate-200 dark:border-slate-700
        animate-[slideUp_0.5s_ease-out]
        flex flex-col
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
          <svg
            className="w-6 h-6 text-white"
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
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Параметры
        </h2>
      </div>

      {/* Settings Content */}
      <div className="space-y-5 flex-1">
        {/* Pages Input */}
        <div className="group">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
            className="
              transition-all duration-200
              hover:border-blue-400 dark:hover:border-blue-500
              focus:scale-[1.01]
            "
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Рекомендуется: 1-10 страниц
          </p>
        </div>

        {/* Notes TextArea */}
        <div className="group">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-purple-600 dark:text-purple-400"
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
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Особые примечания
            </label>
          </div>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="На что обратить внимание при обработке..."
            className="
              transition-all duration-200
              hover:border-purple-400 dark:hover:border-purple-500
              focus:scale-[1.01]
            "
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Укажите ключевые моменты для анализа
          </p>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
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
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Параметры помогут создать более точный и структурированный конспект
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}