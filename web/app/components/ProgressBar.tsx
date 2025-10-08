import Card from '../ui/Card';

interface ProgressBarProps {
  progress: number;
  currentStep: string;
}

export default function ProgressBar({ progress, currentStep }: ProgressBarProps) {
  return (
    <Card variant="bordered" className="mt-6 p-6 animate-[slideUp_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentStep}</span>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
      </div>

      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
        Подготовка → Транскрипция → Суммаризация → PDF
      </p>
    </Card>
  );
}
